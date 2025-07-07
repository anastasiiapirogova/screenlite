import { enforceWorkspacePolicy } from '@/middlewares/enforceWorkspacePolicy.ts'
import { createWorkspaceRoute, HttpMethod } from '@/routes/utils.ts'
import { WORKSPACE_PERMISSIONS } from '@workspaceModules/accessControl/permissions.ts'
import FolderController from './controllers/index.ts'

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/folders',
    handler: FolderController.getWorkspaceFolders,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.view })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/folders/trash',
    handler: FolderController.getWorkspaceSoftDeletedFolders,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.view })
})

createWorkspaceRoute({
    method: HttpMethod.GET,
    path: '/folders/:folderId',
    handler: FolderController.getFolder,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.view })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/folders',
    handler: FolderController.createFolder,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.folder.create })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/folders/move',
    handler: FolderController.moveFolders,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.folder.update })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/folders/delete',
    handler: FolderController.softDeleteFolders,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.delete })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/folders/restore',
    handler: FolderController.restoreFolders,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.delete })
})

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/folders/forceDelete',
    handler: FolderController.forceDeleteFolders,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.file.permanentDelete })
})