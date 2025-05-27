import { getUserWorkspacePermissions, getUserWorkspacePermissionsEager } from '@modules/workspace/utils/getUserWorkspacePermissions.js'
import { Playlist, UserWorkspace } from 'generated/prisma/client.js'
import { SafeUser } from 'types.js'

type PlaylistPolicy = {
    canViewPlaylists: (user: SafeUser, workspaceId: string) => Promise<boolean>
    canCreatePlaylists: (user: SafeUser, workspaceId: string) => Promise<boolean>
    canViewPlaylist: (user: SafeUser, playlist: Partial<Playlist>) => Promise<boolean>
    canViewPlaylistScreens: (user: SafeUser, playlist: Partial<Playlist>) => Promise<boolean>
    canCopyPlaylist: (user: SafeUser, playlist: Partial<Playlist>) => Promise<boolean>
    canUpdatePlaylist: (user: SafeUser, playlist: Partial<Playlist>) => Promise<boolean>
    canDeletePlaylist: (user: SafeUser, playlist: Partial<Playlist>, workspaceUsers?: UserWorkspace[]) => Promise<boolean>
    canManagePlaylistScreens: (user: SafeUser, playlist: Partial<Playlist>) => Promise<boolean>
    canCreatePlaylistSchedule: (user: SafeUser, playlist: Partial<Playlist>) => Promise<boolean>
    canUpdatePlaylistSchedule: (user: SafeUser, playlist: Partial<Playlist>) => Promise<boolean>
    canDeletePlaylistSchedule: (user: SafeUser, playlist: Partial<Playlist>) => Promise<boolean>
}

export const playlistPolicy: PlaylistPolicy = {
    canViewPlaylists: async (user, workspaceId) => {
        return getUserWorkspacePermissions(user, workspaceId)
    },
    canCreatePlaylists: async (user, workspaceId) => {
        return getUserWorkspacePermissions(user, workspaceId)
    },
    canViewPlaylist: async (user, playlist) => {
        return getUserWorkspacePermissions(user, playlist.workspaceId)
    },
    canViewPlaylistScreens: async (user, playlist) => {
        return getUserWorkspacePermissions(user, playlist.workspaceId)
    },
    canCopyPlaylist: async (user, playlist) => {
        return getUserWorkspacePermissions(user, playlist.workspaceId)
    },
    canUpdatePlaylist: async (user, playlist) => {
        return getUserWorkspacePermissions(user, playlist.workspaceId)
    },
    canDeletePlaylist: async (user, playlist, workspaceUsers) => {
        if(workspaceUsers) {
            return getUserWorkspacePermissionsEager(user, workspaceUsers)
        }

        return getUserWorkspacePermissions(user, playlist.workspaceId)
    },
    canManagePlaylistScreens: async (user, playlist) => {
        return getUserWorkspacePermissions(user, playlist.workspaceId)
    },
    canCreatePlaylistSchedule: async (user, playlist) => {
        return getUserWorkspacePermissions(user, playlist.workspaceId)
    },
    canUpdatePlaylistSchedule: async (user, playlist) => {
        return getUserWorkspacePermissions(user, playlist.workspaceId)
    },
    canDeletePlaylistSchedule: async (user, playlist)  => {
        return getUserWorkspacePermissions(user, playlist.workspaceId)
    },
}