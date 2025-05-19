import { MainLayout } from '@/shared/layouts/MainLayout'
import { Navigate } from 'react-router'
import { workspaceMemberRoutes } from '@modules/members/workspaceMemberRoutes'
import { workspacePlaylistContentManagerRoutes } from '@modules/playlistContentManager/workspacePlaylistContentManagerRoutes'
import { workspacePlaylistLayoutEditorRoutes } from '@modules/playlistLayoutEditor/workspacePlaylistLayoutRoutes'
import { workspaceFileRoutes } from '../file/workspaceFileRoutes'
import { workspacePlaylistLayoutRoutes } from '../playlistLayout/workspacePlaylistLayoutRoutes'
import { workspacePlaylistRoutes } from '../playlist/workspacePlaylistRoutes'
import { workspaceScreenRoutes } from '../screen/workspaceScreenRoutes'
import { WorkspaceSidebarLayout } from './layouts/WorkspaceSidebarLayout'
import { UserWorkspacesLayout } from './layouts/UserWorkspacesLayout'
import { CreateWorkspacePage } from './pages/CreateWorkspacePage'
import { UserInvitationsPage } from './pages/UserInvitationsPage'
import { UserWorkspacesPage } from './pages/UserWorkspacesPage'
import { WorkspacePage } from './pages/WorkspacePage'
import { WorkspaceSettingsPage } from './pages/WorkspaceSettingsPage'
import { WorkspaceProvider } from './providers/WorkspaceProvider'

export const workspaceRoutes = {
    element: <MainLayout />,
    children: [
        {
            element: <UserWorkspacesLayout />,
            children: [
                {
                    path: '/',
                    element: <UserWorkspacesPage />,
                },
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