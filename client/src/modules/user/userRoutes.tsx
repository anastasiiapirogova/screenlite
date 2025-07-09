import { sessionRoutes } from '@modules/session/sessionRoutes'
import { MainLayout } from '@shared/layouts/MainLayout'
import { UserFullWidthSettingsPagesLayout } from './layouts/UserFullWidthSettingsPagesLayout'
import { UserPagesLayout } from './layouts/UserPagesLayout'
import {
    AccountSecurityPage,
    ChangeEmailPage,
    EditProfilePage,
    HomePage,
    UserInvitationsPage,
    UserSettingsPage,
    ChangePasswordPage,
    TwoFactorAuthPage,
    UserWorkspacesPage
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
                    path: 'workspaces',
                    element: <UserWorkspacesPage />
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
                sessionRoutes,
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