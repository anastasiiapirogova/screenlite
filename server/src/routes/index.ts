import '@/modules/health/routes.ts'
import '@/modules/auth/routes.ts'
import '@/modules/user/routes.ts'
import '@/modules/session/routes.ts'
import '@/modules/workspace/routes.ts'
import '@/modules/file/routes.ts'
import '@/modules/folder/routes.ts'
import '@/modules/fileUpload/routes.ts'
import '@/modules/member/routes.ts'
import '@/modules/workspaceUserInvitation/routes.ts'
import '@/modules/playlist/routes.ts'
import '@/modules/playlistLayout/routes.ts'
import '@/modules/playlistSchedule/routes.ts'
import '@/modules/screen/routes.ts'
import '@/modules/config/routes.ts'

import { createGuestRoute, HttpMethod, router } from './utils.ts'
import { getImageThumbnail } from '@/modules/static/getImageThumbnail.ts'
import { getFile } from '@/modules/static/getFile.ts'

createGuestRoute({
    method: HttpMethod.GET,
    path: '/static/thumbnail/*',
    handler: getImageThumbnail
})

createGuestRoute({
    method: HttpMethod.GET,
    path: '/static/uploads/*',
    handler: getFile
})

export { router }