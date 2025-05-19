import { getUserWorkspacePermissions } from '@modules/workspace/utils/getUserWorkspacePermissions.js'
import { PlaylistLayout } from '@prisma/client'
import { SafeUser } from 'types.js'

export const playlistLayoutPolicy = {
    canViewPlaylistLayouts: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return getUserWorkspacePermissions(user, workspaceId)
    },
    canViewPlaylistLayout: async (user: SafeUser, playlistLayout: PlaylistLayout): Promise<boolean> => {
        return getUserWorkspacePermissions(user, playlistLayout.workspaceId)
    },
    canUpdatePlaylistLayout: async (user: SafeUser, playlistLayout: PlaylistLayout): Promise<boolean> => {
        return getUserWorkspacePermissions(user, playlistLayout.workspaceId)
    },
    canDeletePlaylistLayout: async (user: SafeUser, playlistLayout: PlaylistLayout): Promise<boolean> => {
        return getUserWorkspacePermissions(user, playlistLayout.workspaceId)
    },
    canCreatePlaylistLayouts: async (user: SafeUser, workspaceId: string): Promise<boolean> => {
        return getUserWorkspacePermissions(user, workspaceId)
    }
}