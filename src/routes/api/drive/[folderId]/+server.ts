import { error, json } from "@sveltejs/kit"
import { drive } from "$lib/server/drive"
import type { RequestHandler } from "./$types"

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) {
    throw error(401, "로그인이 필요합니다.")
  }

  const res = await drive.files.list({
    q: `'${params.folderId.replace(/'/g, "\\'")}' in parents and trashed = false`,
    fields: "files(id, name, mimeType, webViewLink, iconLink, thumbnailLink, modifiedTime, size)",
    orderBy: "folder,name"
  })

  return json({ files: res.data.files ?? [] })
}
