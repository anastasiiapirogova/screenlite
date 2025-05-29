import { MainLayout } from '@/shared/layouts/MainLayout'
import { Navigate } from 'react-router'
import { WorkspaceProvider } from './providers/WorkspaceProvider'
import { CreateWorkspacePage, WorkspacePage, WorkspaceSettingsPage } from './pages'
import { workspaceFileRoutes, workspaceMemberRoutes, workspacePlaylistContentManagerRoutes, workspacePlaylistLayoutEditorRoutes, workspacePlaylistLayoutRoutes, workspacePlaylistRoutes, workspaceScreenRoutes } from '@/routes'
import { WorkspacePagesLayout } from './layouts/WorkspacePagesLayout'
import { WorkspaceFullWidthLayout } from './layouts/WorkspaceFullWidthLayout'

export const workspaceRoutes = {
    element: <MainLayout />,
    children: [
        {
            element: <WorkspaceFullWidthLayout />,
            children: [
                {
                    path: 'workspaces/create',
                    element: <CreateWorkspacePage />
                }
            ]
        },
        {
            path: '/workspaces',
            children: [
                {
                    path: '',
                    element: (
                        <Navigate
                            to="/"
                            replace
                        />
                    ),
                },
            ]
        },
        {
            path: '/workspaces/:workspaceSlug',
            element: <WorkspaceProvider />,
            children: [
                {
                    element: <WorkspacePagesLayout />,
                    children: [
                        {
                            path: '',
                            element: <WorkspacePage />
                        },
                        {
                            path: 'settings',
                            element: <WorkspaceSettingsPage />
                        },
                        workspaceScreenRoutes,
                        workspacePlaylistRoutes,
                        workspacePlaylistLayoutRoutes,
                        workspaceFileRoutes,
                        workspaceMemberRoutes
                    ]
                },
                workspacePlaylistContentManagerRoutes,
                workspacePlaylistLayoutEditorRoutes,
            ]
        }
    ]
}