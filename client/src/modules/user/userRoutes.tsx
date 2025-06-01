import { MainLayout } from '../../shared/layouts/MainLayout'
import { UserFullWidthSettingsPagesLayout } from './layouts/UserFullWidthSettingsPagesLayout'
import { UserPagesLayout } from './layouts/UserPagesLayout'
import {
    AccountSecurityPage,
    ChangeEmailPage,
    UserSessionsPage,
    EditProfilePage,
    HomePage,
    UserInvitationsPage,
    UserSettingsPage,
    ChangePasswordPage,
    TwoFactorAuthPage
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
                    path: 'email/change',
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
                    element: <UserSessionsPage />
                },
                {
                    path: 'password/change',
                    element: <ChangePasswordPage />
                },
                {
                    path: '2fa',
                    element: <TwoFactorAuthPage />
                }
            ]
        }
    ]
}