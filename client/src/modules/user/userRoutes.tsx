import { MainLayout } from '../../shared/layouts/MainLayout'
import { UserFullWidthSettingsPagesLayout } from './layouts/UserFullWidthSettingsPagesLayout'
import { UserPagesLayout } from './layouts/UserPagesLayout'
import {
    AccountSecurityPage,
    ChangeEmailPage,
    CurrentUserSessionsPage,
    EditProfilePage,
    HomePage,
    UserInvitationsPage,
    UserSettingsPage
} from './pages'

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
                },
                {
                    path: 'security',
                    element: <AccountSecurityPage />
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
                    path: 'email',
                    element: <ChangeEmailPage />
                }
            ]
        },
        {
            path: 'security',
            element: <UserFullWidthSettingsPagesLayout />,
            children: [
                {
                    path: 'sessions',
                    element: <CurrentUserSessionsPage />
                }
            ]
        }
    ]
}