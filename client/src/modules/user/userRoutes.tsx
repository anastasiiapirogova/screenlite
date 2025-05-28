import { MainLayout } from '../../shared/layouts/MainLayout'
import { UserSettingsLayout } from './layouts/UserSettingsLayout'
import { CurrentUserSessionsPage, HomePage, UserSettingsPage } from './pages'


export const userRoutes = {
    element: <MainLayout />,
    children: [
        {
            path: '',
            element: <HomePage />
        },
        {
            path: 'settings',
            element: <UserSettingsLayout />,
            children: [
                {
                    path: '',
                    element: <UserSettingsPage />
                },
                {
                    path: 'sessions',
                    element: <CurrentUserSessionsPage />
                }
            ],
        }
    ]
}