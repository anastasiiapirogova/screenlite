import { SafeUser } from 'types.js'

export const userPolicy = {
    canChangePassword: (user: SafeUser, targetUserId: string) => {
        return user.id === targetUserId
    },
    canDeleteUser: (user: SafeUser, targetUserId: string) => {
        return user.id === targetUserId
    },
}