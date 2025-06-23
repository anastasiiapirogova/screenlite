import { SafeUser } from '@/types.js'

export class SessionPolicy{
    static canAccessUserSessions(user: SafeUser, userId: string): boolean {
        return user.id === userId
    }

    static canTerminateSession(user: SafeUser, sessionUserId: string): boolean {
        return user.id === sessionUserId
    }
}