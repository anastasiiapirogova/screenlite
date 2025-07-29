import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { AdminPermissionName } from '../enums/admin-permission-name.enum.ts'

export abstract class AuthContext {
    constructor(public readonly type: AuthContextType) {}
  
    protected _adminPermissions: AdminPermissionName[] = []

    setAdminPermissions(permissions: AdminPermissionName[]): this {
        this._adminPermissions = permissions
        return this
    }

    abstract getAdminPermissions(): AdminPermissionName[];
  
    hasAdminPermission(permission: AdminPermissionName): boolean {
        return this.getAdminPermissions().includes(permission)
    }

    abstract hasAdminAccess(): boolean

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
}