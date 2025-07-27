import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { IAuthorizationService } from '../ports/authorization-service.interface.ts'
import { User } from '../entities/user.entity.ts'
import { AuthContextType } from '../enums/auth-context-type.enum.ts'
import { IAuthContext } from '../ports/auth-context.interface.ts'

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
        return this._authContext !== null
    }

    isUserContext(): boolean {
        return this._authContext?.type === AuthContextType.UserSession
    }
  
    currentUser(): User | null {
        return this._authContext?.type === AuthContextType.UserSession
            ? this._authContext.user 
            : null
    }

    isAdmin(): boolean {
        if (!this._authContext) return false
        
        return this._authContext.type === AuthContextType.AdminApiKey || (this._authContext.type === AuthContextType.UserSession && !!this._authContext.user.isAdmin)
    }

    isSuperAdmin(): boolean {
        if (!this._authContext) return false

        if(this._authContext.type === AuthContextType.UserSession) {
            return !!this._authContext.user.isSuperAdmin
        }

        return false
    }

    hasAdminAccess(): boolean {
        if (!this._authContext) return false

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