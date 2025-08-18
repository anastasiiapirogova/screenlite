import { useQuery, useQueryClient } from '@tanstack/react-query'
import { currentUserQuery } from '../api/currentUser'
import { removeAuthToken, storeAuthToken } from '../helpers/authToken'
import { AuthContext } from '../contexts/AuthContext'
import { Outlet } from 'react-router'
import { LoginRequestResponse } from '../api/login'
import { AuthPreloader } from '@shared/components/AuthPreloader'
import { CurrentUserData } from '../types'

export const AuthProvider = () => {
    const queryClient = useQueryClient()

    const { data: currentUserData } = useQuery<CurrentUserData | null>(currentUserQuery())

    const handleLogin = (data: LoginRequestResponse) => {
        storeAuthToken(data.token)

        queryClient.setQueryData(currentUserQuery().queryKey, data.user)
    }

    const handleLogout = () => {
        removeAuthToken()
        queryClient.setQueryData(currentUserQuery().queryKey, null)
    }

    if (currentUserData === undefined) {
        return <AuthPreloader />
    }

    const contextValue = {
        user: currentUserData?.user,
        sessionId: currentUserData?.sessionId,
        hasCompletedTwoFactorAuth: currentUserData?.hasCompletedTwoFactorAuth,
        twoFactorAuthEnabled: currentUserData?.twoFactorAuthEnabled,
        onLogin: handleLogin,
        onLogout: handleLogout,
    }

    return (
        <AuthContext.Provider value={ contextValue }>
            <Outlet />
        </AuthContext.Provider>
    )
}
