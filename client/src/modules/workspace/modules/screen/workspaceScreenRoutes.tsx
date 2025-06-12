import { WorkspaceScreenLayout } from './layouts/WorkspaceScreenLayout'
import { WorkspaceScreenPage } from './pages/WorkspaceScreenPage'
import { WorkspaceScreenPlaylistsPage } from './pages/WorkspaceScreenPlaylistsPage'
import { WorkspaceScreensPage } from './pages/WorkspaceScreensPage'
import { ScreenProvider } from './providers/ScreenProvider'

export const workspaceScreenRoutes = {
    path: 'screens',
    children: [
        {
            path: '',
            element: <WorkspaceScreensPage />,
        },
        {
            path: ':screenId',
            element: <ScreenProvider />,
            children: [
                {
                    element: <WorkspaceScreenLayout />,
                    children: [
                        {
                            path: '',
                            element: <WorkspaceScreenPage />
                        },
                        {
                            path: 'playlists',
                            element: <WorkspaceScreenPlaylistsPage />
                        }
                    ]
                }
               
            ]
        }
    ]
}