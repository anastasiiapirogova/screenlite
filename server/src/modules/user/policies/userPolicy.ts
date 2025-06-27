import { SafeUser } from '@/types.ts'

export class UserPolicy {
    static canChangePassword(user: SafeUser, targetUserId: string) {
        return user.id === targetUserId
    }
    
    static canChangeEmail(user: SafeUser, targetUserId: string) {
        return user.id === targetUserId
    }

    static canDeleteUser(user: SafeUser, targetUserId: string) {
        return user.id === targetUserId
    }

    static canUpdateUser(user: SafeUser, targetUserId: string) {
        return user.id === targetUserId
    }

    static canViewUserWorkspaces(user: SafeUser, targetUserId: string) {
        return user.id === targetUserId
    }
}