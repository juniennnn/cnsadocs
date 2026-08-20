// src/lib/server/folder-token.ts
// The client never sees a raw Drive folder id. Every folder the server hands out
// is wrapped in an HMAC-signed token, and the API only accepts tokens it signed,
// so an authenticated user cannot browse arbitrary folders by guessing ids.

import { env } from "$env/dynamic/private"
import { base64urlDecode, base64urlEncode } from "./base64url"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

let keyPromise: Promise<CryptoKey> | null = null

function getKey(): Promise<CryptoKey> {
  if (!keyPromise) {
    const secret = env.PRIVATE_FOLDER_TOKEN_SECRET
    if (!secret) throw new Error("PRIVATE_FOLDER_TOKEN_SECRET is not set")
    keyPromise = crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    )
  }
  return keyPromise
}

export async function signFolderId(folderId: string): Promise<string> {
  const payload = encoder.encode(folderId)
  const signature = await crypto.subtle.sign("HMAC", await getKey(), payload)
  return `${base64urlEncode(payload)}~${base64urlEncode(signature)}`
}

/** Returns the folder id, or null if the token is malformed or not ours. */
export async function verifyFolderToken(token: string): Promise<string | null> {
  const [encodedId, encodedSignature] = token.split("~")
  if (!encodedId || !encodedSignature) return null

  let payload: Uint8Array<ArrayBuffer>
  let signature: Uint8Array<ArrayBuffer>
  try {
    payload = base64urlDecode(encodedId)
    signature = base64urlDecode(encodedSignature)
  } catch {
    return null
  }

  // subtle.verify compares in constant time.
  const valid = await crypto.subtle.verify("HMAC", await getKey(), signature, payload)
  return valid ? decoder.decode(payload) : null
}
