import {
    Navigate,
    Outlet,
    useLocation,
} from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { TwoFaMiddleware } from './TwoFaMiddleware'
import { guestRoutes } from '@shared/routes/guestRoutes'

export const PrivateRouteMiddleware = () => {
    const { user } = useAuth()
    const location = useLocation()

    if (!user) {
        const path = location.pathname + location.search

        const shouldRedirect =
			path &&
			path !== '/' &&
			path !== '/?' &&
			path !== '?'

        const to = shouldRedirect
            ? `${guestRoutes.login}?redirect=${encodeURIComponent(path)}`
            : guestRoutes.login

        return (
            <Navigate
                to={ to }
                replace
            />
        )
    }

    return (
        <TwoFaMiddleware>
            <Outlet />
        </TwoFaMiddleware>
    )
}
