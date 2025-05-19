import { MainLayout } from '../../shared/layouts/MainLayout'
import { UserSettingsLayout } from './layouts/UserSettingsLayout'
import { CurrentUserSessionsPage } from './pages/CurrentUserSessionsPage'
import { UserSettingsPage } from './pages/UserSettingsPage'

export const userRoutes = {
    element: <MainLayout />,
    children: [
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