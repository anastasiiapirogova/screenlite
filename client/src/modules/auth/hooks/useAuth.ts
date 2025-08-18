import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export const useAuth = () => {
    const data = useContext(AuthContext)

    if (!data) {
        throw new Error('useAuth must be used within a CurrentUserProvider')
    }

    return data
}