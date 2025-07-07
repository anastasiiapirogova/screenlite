import { enforceWorkspacePolicy } from '@/middlewares/enforceWorkspacePolicy.ts'
import FileController from '@/modules/file/controllers/index.ts'
import { createWorkspaceRoute, HttpMethod } from '@/routes/utils.ts'
import { WORKSPACE_PERMISSIONS } from '@workspaceModules/accessControl/permissions.ts'

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/files',
    handler: FileController.getWorkspaceFiles,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.view })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/files/trash',
    handler: FileController.getWorkspaceSoftDeletedFiles,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.view })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/files/:fileId',
    handler: FileController.getFile,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.view })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/files/:fileId/playlists',
    handler: FileController.getFilePlaylists,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.view })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/move',
    handler: FileController.moveFiles,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.update })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/delete',
    handler: FileController.softDeleteFiles,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.delete })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/restore',
    handler: FileController.restoreFiles,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.delete })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/emptyTrash',
    handler: FileController.emptyTrash,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.permanentDelete })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/files/forceDelete',
    handler: FileController.forceDeleteFiles,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.permanentDelete })
})