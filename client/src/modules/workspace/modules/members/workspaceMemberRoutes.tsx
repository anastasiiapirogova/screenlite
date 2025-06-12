import { WorkspaceMembersListPage } from './pages/WorkspaceMembersListPage'
import { WorkspaceMembersPage } from './pages/WorkspaceMembersPage'

export const workspaceMemberRoutes = {
    path: 'members',
    children: [
        {
            path: '',
            element: <WorkspaceMembersPage />,
        },
        {
            path: 'list',
            element: <WorkspaceMembersListPage />,
        }
    ]
}