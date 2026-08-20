// src/lib/server/drive.ts
import { google } from "googleapis"
import { PRIVATE_GOOGLE_SERVICE_ACCOUNT_KEY } from "$env/static/private"

const credentials = JSON.parse(PRIVATE_GOOGLE_SERVICE_ACCOUNT_KEY)

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"]
})

export const drive = google.drive({ version: "v3", auth })