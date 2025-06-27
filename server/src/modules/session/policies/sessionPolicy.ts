import { SafeUser } from '@/types.ts'

export class SessionPolicy{
    static canAccessUserSessions(user: SafeUser, userId: string): boolean {
        return user.id === userId
    }

    static canTerminateSession(user: SafeUser, sessionUserId: string): boolean {
        return user.id === sessionUserId
    }
}