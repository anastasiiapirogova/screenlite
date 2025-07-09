import { useQuery, useQueryClient } from '@tanstack/react-query'
import { User } from '../../user/types'
import { currentUserQuery } from '../api/currentUser'
import { removeAuthToken, storeAuthToken } from '../helpers/authToken'
import { AuthContext } from '../contexts/AuthContext'
import { Outlet } from 'react-router'
import { LoginRequestResponse } from '../api/login'
import { AuthPreloader } from '@shared/components/AuthPreloader'

export const AuthProvider = () => {
    const queryClient = useQueryClient()

    const { data: user } = useQuery<User | null>(currentUserQuery())

    const handleLogin = (data: LoginRequestResponse) => {
        storeAuthToken(data.token)

        queryClient.setQueryData(currentUserQuery().queryKey, data.user)
    }

    const handleLogout = () => {
        removeAuthToken()
        queryClient.setQueryData(currentUserQuery().queryKey, null)
    }

    if (user === undefined) {
        return <AuthPreloader />
    }

    const contextValue = {
        user,
        onLogin: handleLogin,
        onLogout: handleLogout,
    }

    return (
        <AuthContext.Provider value={ contextValue }>
            <Outlet />
        </AuthContext.Provider>
    )
}
