import { useMutation } from '@tanstack/react-query'
import { logoutRequest } from '../api/requests/logoutRequest'
import { useAuth } from './useAuth'

export const useLogout = () => {
    const auth = useAuth()

    const { mutate, isPending } = useMutation({
        mutationFn: logoutRequest,
        onSuccess: auth.onLogout,
        onError: (error) => {
            console.error(error)
        }
    })

    const logout = () => {
        mutate()
    }

    return {
        logout,
        isPending
    }
}