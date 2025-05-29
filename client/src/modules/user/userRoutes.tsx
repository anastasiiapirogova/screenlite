import { MainLayout } from '../../shared/layouts/MainLayout'
import { UserFullWidthSettingsPagesLayout } from './layouts/UserFullWidthSettingsPagesLayout'
import { UserPagesLayout } from './layouts/UserPagesLayout'
import { CurrentUserSessionsPage, HomePage, UserInvitationsPage, UserSettingsPage } from './pages'
import { EditProfilePage } from './pages/EditProfilePage'

export const userRoutes = {
    element: <MainLayout />,
    children: [
        {
            element: <UserPagesLayout />,
            children: [
                {
                    path: '',
                    element: <HomePage />
                },
                {
                    path: 'invitations',
                    element: <UserInvitationsPage />
                },
                {
                    path: 'settings',
                    element: <UserSettingsPage />
                }
            ]
        },
        {
            path: 'settings',
            element: <UserFullWidthSettingsPagesLayout />,
            children: [
                {
                    path: 'profile',
                    element: <EditProfilePage />
                },
                {
                    path: 'sessions',
                    element: <CurrentUserSessionsPage />
                }
            ]
        }
    ]
}