import { WorkspacePlaylistLayoutLayout } from './layouts/WorkspacePlaylistLayoutLayout'
import { WorkspacePlaylistLayoutPage } from './pages/WorkspacePlaylistLayoutPage'
import { WorkspacePlaylistLayoutPlaylistsPage } from './pages/WorkspacePlaylistLayoutPlaylistsPage'
import { WorkspacePlaylistLayoutsPage } from './pages/WorkspacePlaylistLayoutsPage'
import { PlaylistLayoutProvider } from './providers/PlaylistLayoutProvider'

export const workspacePlaylistLayoutRoutes = {
    path: 'layouts',
    children: [
        {
            path: '',
            element: <WorkspacePlaylistLayoutsPage />,
        },
        {
            path: ':playlistLayoutId',
            element: <PlaylistLayoutProvider />,
            children: [
                {
                    element: <WorkspacePlaylistLayoutLayout />,
                    children: [
                        {
                            path: '',
                            element: <WorkspacePlaylistLayoutPage />
                        },
                        {
                            path: 'playlists',
                            element: <WorkspacePlaylistLayoutPlaylistsPage />
                        },
                    ]
                }
            ]
        }
    ]
}