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
        const redirectPath = location.pathname + location.search

        return (
            <Navigate
                to={ `${guestRoutes.login}?redirect=${encodeURIComponent(redirectPath)}` }
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
