import { WorkspacePlaylistLayout } from './layouts/WorkspacePlaylistLayout'
import { WorkspacePlaylistPage } from './pages/WorkspacePlaylistPage'
import { WorkspacePlaylistSchedulesPage } from './pages/WorkspacePlaylistSchedulesPage'
import { WorkspacePlaylistScreensPage } from './pages/WorkspacePlaylistScreensPage'
import { WorkspacePlaylistsPage } from './pages/WorkspacePlaylistsPage'
import { PlaylistProvider } from './providers/PlaylistProvider'
import { WorkspacePlaylistEditPage } from './pages/WorkspacePlaylistEditPage'

export const workspacePlaylistRoutes = {
    path: 'playlists',
    children: [
        {
            path: '',
            element: <WorkspacePlaylistsPage />,
        },
        {
            path: ':playlistId',
            element: <PlaylistProvider />,
            children: [
                {
                    element: <WorkspacePlaylistLayout />,
                    children: [
                        {
                            path: '',
                            element: <WorkspacePlaylistPage />
                        },
                        {
                            path: 'schedules',
                            element: <WorkspacePlaylistSchedulesPage />
                        },
                        {
                            path: 'screens',
                            element: <WorkspacePlaylistScreensPage />
                        },
                        {
                            path: 'edit',
                            element: <WorkspacePlaylistEditPage />
                        }
                    ]
                }
            ]
        }
    ]
}
