import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { AdminPermissionName } from '../enums/admin-permission-name.enum.ts'

export abstract class AuthContextAbstract {
    constructor(public readonly type: AuthContextType) {}
  
    protected _adminPermissions: AdminPermissionName[] = []

    abstract hasAdminAccess(): boolean

    abstract getAdminPermissions(): AdminPermissionName[]

    setAdminPermissions(permissions: AdminPermissionName[]): void {
        this._adminPermissions = permissions
    }
  
    hasAdminPermission(permission: AdminPermissionName): boolean {
        return this.getAdminPermissions().includes(permission)
    }

    isUserContext(): boolean {
        return this.type === AuthContextType.UserSession
    }

    isAdminApiKeyContext(): boolean {
        return this.type === AuthContextType.AdminApiKey
    }

    isWorkspaceApiKeyContext(): boolean {
        return this.type === AuthContextType.WorkspaceApiKey
    }

    isSystemContext(): boolean {
        return this.type === AuthContextType.System
    }

    isGuestContext(): boolean {
        return this.type === AuthContextType.Guest
    }
}