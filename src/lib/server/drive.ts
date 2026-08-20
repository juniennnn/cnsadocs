// src/lib/server/drive.ts
// Minimal Google Drive client for Cloudflare Workers.
//
// The `googleapis` package cannot run here — it pulls in node:http2, node-fetch,
// https-proxy-agent and friends, none of which exist on Workers. Instead we sign
// the service-account JWT with WebCrypto and talk to the Drive REST API over fetch.

import { env } from "$env/dynamic/private"
import { base64urlEncode } from "./base64url"

const TOKEN_URL = "https://oauth2.googleapis.com/token"
const FILES_URL = "https://www.googleapis.com/drive/v3/files"
const SCOPE = "https://www.googleapis.com/auth/drive.readonly"

/** Safety net so a pathological folder tree can't spin forever. */
const MAX_PAGES = 10

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  webViewLink?: string
  modifiedTime?: string
  size?: string
}

interface ServiceAccount {
  client_email: string
  private_key: string
}

interface AccessToken {
  token: string
  expiresAt: number
}

function encodeJson(value: unknown): string {
  return base64urlEncode(new TextEncoder().encode(JSON.stringify(value)))
}

function pemToPkcs8(pem: string): Uint8Array<ArrayBuffer> {
  const body = pem.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, "").replace(/\s+/g, "")
  const binary = atob(body)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function readServiceAccount(): ServiceAccount {
  const raw = env.PRIVATE_GOOGLE_SERVICE_ACCOUNT_KEY
  if (!raw) throw new Error("PRIVATE_GOOGLE_SERVICE_ACCOUNT_KEY is not set")

  let parsed: ServiceAccount
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error("PRIVATE_GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON")
  }
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("PRIVATE_GOOGLE_SERVICE_ACCOUNT_KEY is missing client_email or private_key")
  }
  return parsed
}

async function requestAccessToken(): Promise<AccessToken> {
  const credentials = readServiceAccount()
  const issuedAt = Math.floor(Date.now() / 1000)

  const payload = `${encodeJson({ alg: "RS256", typ: "JWT" })}.${encodeJson({
    iss: credentials.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: issuedAt,
    exp: issuedAt + 3600
  })}`

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToPkcs8(credentials.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(payload)
  )

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${payload}.${base64urlEncode(signature)}`
    })
  })
  if (!res.ok) {
    throw new Error(`Google token exchange failed (${res.status}): ${await res.text()}`)
  }

  const data = (await res.json()) as { access_token: string; expires_in: number }
  return { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
}

// Cached per isolate. `inflight` collapses concurrent refreshes into one exchange.
let cached: AccessToken | null = null
let inflight: Promise<AccessToken> | null = null

async function getAccessToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token

  const pending = (inflight ??= requestAccessToken().finally(() => {
    inflight = null
  }))
  cached = await pending
  return cached.token
}

function buildQuery(folderId: string, pageToken?: string): string {
  // Drive query strings escape backslash and single quote.
  const escaped = folderId.replace(/\\/g, "\\\\").replace(/'/g, "\\'")
  const params = new URLSearchParams({
    q: `'${escaped}' in parents and trashed = false`,
    fields: "nextPageToken, files(id, name, mimeType, webViewLink, modifiedTime, size)",
    orderBy: "folder,name",
    pageSize: "1000"
  })
  if (pageToken) params.set("pageToken", pageToken)
  return params.toString()
}

async function fetchPage(folderId: string, pageToken: string | undefined, retryOn401: boolean) {
  const res = await fetch(`${FILES_URL}?${buildQuery(folderId, pageToken)}`, {
    headers: { authorization: `Bearer ${await getAccessToken()}` }
  })

  // A cached token can be revoked server-side before it expires; refresh once.
  if (res.status === 401 && retryOn401) {
    cached = null
    return fetchPage(folderId, pageToken, false)
  }
  if (!res.ok) {
    throw new Error(`Drive files.list failed (${res.status}): ${await res.text()}`)
  }

  return (await res.json()) as { files?: DriveFile[]; nextPageToken?: string }
}

export async function listFolder(folderId: string): Promise<DriveFile[]> {
  const files: DriveFile[] = []
  let pageToken: string | undefined

  for (let page = 0; page < MAX_PAGES; page++) {
    const data = await fetchPage(folderId, pageToken, true)
    files.push(...(data.files ?? []))
    pageToken = data.nextPageToken
    if (!pageToken) break
  }

  return files
}
