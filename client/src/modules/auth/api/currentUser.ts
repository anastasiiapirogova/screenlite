import axios from '@config/axios'
import { CurrentUserData } from '../types'
import { isAxiosError } from 'axios'

type CurrentUserRequestResponse = CurrentUserData

export const currentUserRequest = async () => {
    try {
        const response = await axios.get<CurrentUserRequestResponse>('auth/me')

        return response.data
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            if (error.response?.status === 401) {
                return null
            }
        }

        throw error
    }
}

export const currentUserQuery = () => ({
    queryKey: ['currentUser'],
    queryFn: currentUserRequest,
})