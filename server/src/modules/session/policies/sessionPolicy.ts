import { SafeUser } from 'types.js'

export const sessionPolicy = {
    canAccessUserSessions: (user: SafeUser, userId: string): boolean => {
        return user.id === userId
    },

}