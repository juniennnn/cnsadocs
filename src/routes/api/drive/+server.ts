import { error, json } from "@sveltejs/kit"
import { listFolder } from "$lib/server/drive"
import { signFolderId, verifyFolderToken } from "$lib/server/folder-token"
import type { RequestHandler } from "./$types"

const FOLDER_MIME = "application/vnd.google-apps.folder"

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) {
    throw error(401, "로그인이 필요합니다.")
  }

  const token = url.searchParams.get("folder")
  if (!token) {
    throw error(400, "폴더가 지정되지 않았습니다.")
  }

  const folderId = await verifyFolderToken(token)
  if (!folderId) {
    throw error(403, "접근할 수 없는 폴더입니다.")
  }

  const files = await listFolder(folderId)

  // Subfolders go out as signed tokens; files go out as plain links. Raw folder
  // ids never reach the client, so there is nothing to tamper with.
  const entries = await Promise.all(
    files.map(async (file) => {
      const isFolder = file.mimeType === FOLDER_MIME
      return {
        name: file.name,
        mimeType: file.mimeType,
        isFolder,
        modifiedTime: file.modifiedTime,
        token: isFolder ? await signFolderId(file.id) : undefined,
        link: isFolder
          ? undefined
          : (file.webViewLink ?? `https://drive.google.com/file/d/${file.id}/view`)
      }
    })
  )

  return json({ files: entries })
}
