import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { IAuthorizationService } from '../ports/authorization-service.interface.ts'
import { User } from '../entities/user.entity.ts'
import { AuthContextType } from '../enums/auth-context-type.enum.ts'
import { IAuthContext, IUserSessionAuthContext } from '../ports/auth-context.interface.ts'

export class AuthorizationService implements IAuthorizationService {
    private _authContext: IAuthContext | null = null
    
    get authContext(): IAuthContext {
        if (!this._authContext) {
            throw new Error('Authentication context not set')
        }
        return this._authContext
    }

    setAuthContext(context: IAuthContext | null) {
        this._authContext = context
    }

    isAuthenticated(): boolean {
        const authContext = this._authContext

        if (!authContext) return false

        return true
    }

    isUserContext(): boolean {
        const authContext = this._authContext

        if (!authContext) return false

        return authContext.type === AuthContextType.UserSession
    }

    currentUser(): User | null {
        if(!this.isUserContext()) return null

        return (this._authContext as IUserSessionAuthContext).user
    }

    private getUserSessionContext(): IUserSessionAuthContext | null {
        if(!this.isUserContext()) return null

        return this._authContext as IUserSessionAuthContext
    }

    isAdmin(): boolean {
        if (!this._authContext) return false

        if (this._authContext.type === AuthContextType.AdminApiKey) return true

        const userSession = this.getUserSessionContext()

        if (!userSession) return false

        return !!userSession.user.hasAdminAccess
    }

    isSuperAdmin(): boolean {
        const userSession = this.getUserSessionContext()

        if (!userSession) return false

        return !!userSession.user.isSuperAdmin
    }

    hasAdminAccess(): boolean {
        return this.isAdmin() || this.isSuperAdmin()
    }

    hasAdminPermission(
        actorPermissions: AdminPermissionName[] | null,
        requiredPermissions: AdminPermissionName | AdminPermissionName[]
    ): boolean {
        if (!actorPermissions) return false

        const required = Array.isArray(requiredPermissions)
            ? requiredPermissions
            : [requiredPermissions]

        return required.some(perm => actorPermissions.includes(perm))
    }
}
