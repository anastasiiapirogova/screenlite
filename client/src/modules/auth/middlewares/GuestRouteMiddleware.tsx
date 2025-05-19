import {
    Navigate,
    Outlet,
    useLocation,
} from 'react-router'
import { useAuth } from '../hooks/useAuth'
			
export const GuestRouteMiddleware = () => {
    const { user } = useAuth()
			
    const location = useLocation()

    const urlParams = new URLSearchParams(location.search)

    const redirectPath = urlParams.get('redirect') || '/'
			
    if (user) {
        return (
            <Navigate
                to={ redirectPath }
                replace
            />
        )
    }

    return <Outlet />
}
			