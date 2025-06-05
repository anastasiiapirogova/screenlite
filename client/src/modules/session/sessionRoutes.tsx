import { CurrentUserSessionsPage } from './pages/CurrentUserSessionsPage'

export const sessionRoutes = {
    path: 'sessions',
    element: <CurrentUserSessionsPage />
}

export type UserSessionStatus = 'active' | 'revoked'