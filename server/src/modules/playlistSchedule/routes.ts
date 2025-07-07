import { enforceWorkspacePolicy } from '@/middlewares/enforceWorkspacePolicy.ts'
import PlaylistScheduleController from '@/modules/playlistSchedule/controllers/index.ts'
import { createWorkspaceRoute, HttpMethod } from '@/routes/utils.ts'
import { WORKSPACE_PERMISSIONS } from '@workspaceModules/accessControl/permissions.ts'

createWorkspaceRoute({
    method: HttpMethod.POST,
    path: '/playlistSchedules',
    handler: PlaylistScheduleController.createPlaylistSchedule,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.update })
})

createWorkspaceRoute({
    method: HttpMethod.PATCH,
    path: '/playlistSchedules/:playlistScheduleId',
    handler: PlaylistScheduleController.updatePlaylistSchedule,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.update })
})

createWorkspaceRoute({
    method: HttpMethod.DELETE,
    path: '/playlistSchedules/:playlistScheduleId',
    handler: PlaylistScheduleController.deletePlaylistSchedule,
    enforcePolicy: enforceWorkspacePolicy({ permission: WORKSPACE_PERMISSIONS.playlist.update })
})