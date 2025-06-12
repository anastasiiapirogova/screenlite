import { PlaylistProvider } from '@modules/workspace/modules/playlist/providers/PlaylistProvider'
import { WorkspacePlaylistContentManagerPage } from './pages/WorkspacePlaylistContentManagerPage'

export const workspacePlaylistContentManagerRoutes = {
    path: 'playlists/:playlistId/content',
    element: <PlaylistProvider />,
    children: [
        {
            path: '',
            element: <WorkspacePlaylistContentManagerPage />
        },
    ]
}