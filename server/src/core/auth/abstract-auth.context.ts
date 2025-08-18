import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { UserSessionAuthContext } from '@/core/auth/user-session-auth.context.ts'
import { AdminApiKeyAuthContext } from '@/core/auth/admin-api-key-auth.context.ts'
import { WorkspaceApiKeyAuthContext } from '@/core/auth/workspace-api-key-auth.context.ts'
import { SystemAuthContext } from '@/core/auth/system-auth.context.ts'
import { GuestAuthContext } from '@/core/auth/guest-auth.context.ts'
import { AuthSession } from '../value-objects/auth-session.value-object.ts'

export abstract class AbstractAuthContext {
    constructor(public readonly type: AuthContextType) {}
  
    protected _adminPermissions: AdminPermissionName[] = []

    abstract hasAdminAccess(): boolean

    abstract getAdminPermissions(): AdminPermissionName[]

    get session(): AuthSession | undefined {
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