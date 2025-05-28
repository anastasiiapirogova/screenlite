import { SafeUser } from 'types.js'

export class UserPolicy {
    static canChangePassword(user: SafeUser, targetUserId: string) {
        return user.id === targetUserId
    }
    
    static canDeleteUser(user: SafeUser, targetUserId: string) {
        return user.id === targetUserId
    }

    static canUpdateUser(user: SafeUser, targetUserId: string) {
        return user.id === targetUserId
    }
}