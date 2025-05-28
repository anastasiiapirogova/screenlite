import { MainLayout } from '@/shared/layouts/MainLayout'
import { Navigate } from 'react-router'
import { WorkspaceSidebarLayout } from './layouts/WorkspaceSidebarLayout'
import { UserWorkspacesLayout } from './layouts/UserWorkspacesLayout'
import { WorkspaceProvider } from './providers/WorkspaceProvider'
import { CreateWorkspacePage, UserInvitationsPage, WorkspacePage, WorkspaceSettingsPage } from './pages'
import { workspaceFileRoutes, workspaceMemberRoutes, workspacePlaylistContentManagerRoutes, workspacePlaylistLayoutEditorRoutes, workspacePlaylistLayoutRoutes, workspacePlaylistRoutes, workspaceScreenRoutes } from '@/routes'

export const workspaceRoutes = {
    element: <MainLayout />,
    children: [
        {
            element: <UserWorkspacesLayout />,
            children: [
                {
                    path: 'invitations',
                    element: <UserInvitationsPage />
                },
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
                    element: <WorkspaceSidebarLayout />,
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