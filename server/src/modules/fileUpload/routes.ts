import { enforceWorkspacePolicy } from '@/middlewares/enforceWorkspacePolicy.ts'
import FileUploadController from '@/modules/fileUpload/controllers/index.ts'
import { createWorkspaceRoute, HttpMethod } from '@/routes/utils.ts'
import { WORKSPACE_PERMISSIONS } from '@workspaceModules/accessControl/permissions.ts'

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/uploadSessions',
    handler: FileUploadController.createFileUploadSession,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.upload })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/uploadSessions/:fileUploadSessionId/cancel',
    handler: FileUploadController.cancelFileUploading,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.upload })
})

createWorkspaceRoute({
    method: HttpMethod.PUT,
    path: '/files/uploadSessions/:fileUploadSessionId/uploadPart',
    handler: FileUploadController.uploadFilePart,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.upload })
})