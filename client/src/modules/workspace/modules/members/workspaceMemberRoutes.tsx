import { WorkspaceMembersPage } from './pages/WorkspaceMembersPage'

export const workspaceMemberRoutes = {
    path: 'members',
    children: [
        {
            path: '',
            element: <WorkspaceMembersPage />,
        }
    ]
}