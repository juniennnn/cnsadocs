import { env } from "$env/dynamic/private"
import { error } from "@sveltejs/kit"
import { signFolderId } from "$lib/server/folder-token"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async () => {
  const rootFolderId = env.PRIVATE_DRIVE_FOLDER_ID
  if (!rootFolderId) {
    throw error(500, "드라이브 폴더가 설정되지 않았습니다.")
  }

  return { rootToken: await signFolderId(rootFolderId) }
}
