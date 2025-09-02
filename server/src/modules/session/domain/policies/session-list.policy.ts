import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'

export class SessionListPolicy {
    constructor(
        private readonly authContext: AuthContext
    ) {}

    canViewAllSessions(): boolean {
        if(this.authContext.hasAdminAccess()) {
            const hasAdminPermission = this.authContext.hasAdminPermission(AdminPermissionName.SESSIONS_VIEW)

            if(hasAdminPermission) {
                return true
            }
        }

        return false
    }

    enforceViewAllSessions(): void {
        if(!this.canViewAllSessions()) {
            throw new ForbiddenError({
                userId: ['YOU_CANNOT_VIEW_ALL_SESSIONS']
            })
        }
    }

    canViewSessionsForUser(userId: string): boolean {
        if(this.authContext.isUserContext()) {
            const user = this.authContext.user

            return user.id === userId
        }

        return false
    }

    enforceViewSessionsForUser(userId: string): void {
        if(!this.canViewSessionsForUser(userId)) {
            throw new ForbiddenError({
                userId: ['YOU_CANNOT_VIEW_SESSIONS_FOR_USER']
            })
        }
    }
}