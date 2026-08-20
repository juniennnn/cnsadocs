import { PRIVATE_DRIVE_FOLDER_ID } from "$env/static/private"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async () => {
  return { rootFolderId: PRIVATE_DRIVE_FOLDER_ID }
}
