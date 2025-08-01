import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { AdminPermissionName } from '../enums/admin-permission-name.enum.ts'
import { UserSessionAuthContext } from './user-session-auth.context.ts'
import { AdminApiKeyAuthContext } from './admin-api-key-auth.context.ts'
import { WorkspaceApiKeyAuthContext } from './workspace-api-key-auth.context.ts'
import { SystemAuthContext } from './system-auth.context.ts'
import { GuestAuthContext } from './guest-auth.context.ts'
import { Session } from '../entities/session.entity.ts'

export abstract class AuthContextAbstract {
    constructor(public readonly type: AuthContextType) {}
  
    protected _adminPermissions: AdminPermissionName[] = []

    abstract hasAdminAccess(): boolean

    abstract getAdminPermissions(): AdminPermissionName[]

    get session(): Session | undefined {
        return undefined
    }

    setAdminPermissions(permissions: AdminPermissionName[]): void {
        this._adminPermissions = permissions
    }
  
    hasAdminPermission(permission: AdminPermissionName): boolean {
        return this.getAdminPermissions().includes(permission)
    }

    isUserContext(): this is UserSessionAuthContext {
        return this.type === AuthContextType.UserSession
    }

    isAdminApiKeyContext(): this is AdminApiKeyAuthContext {
        return this.type === AuthContextType.AdminApiKey
    }

    isWorkspaceApiKeyContext(): this is WorkspaceApiKeyAuthContext {
        return this.type === AuthContextType.WorkspaceApiKey
    }

    isSystemContext(): this is SystemAuthContext {
        return this.type === AuthContextType.System
    }

    isGuestContext(): this is GuestAuthContext {
        return this.type === AuthContextType.Guest
    }
}