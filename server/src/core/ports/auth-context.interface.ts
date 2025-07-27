import { User } from '@/core/entities/user.entity.ts'
import { Session } from '@/core/entities/session.entity.ts'
import { AdminPermission } from '../entities/admin-permission.entity.ts'
import { AuthContextType } from '../enums/auth-context-type.enum.ts'

export type ISystemAuthContext = {
    type: AuthContextType.System
}

export type IUserSessionAuthContext = {
    type: AuthContextType.UserSession
    user: User
    session: Session
    adminPermissions: AdminPermission[] | null
}

export type IWorkspaceApiKeyAuthContext = {
    type: AuthContextType.WorkspaceApiKey
}

export type IAdminApiKeyAuthContext = {
    type: AuthContextType.AdminApiKey
    adminPermissions: AdminPermission[] | null
}

export type IAuthContext = ISystemAuthContext | IUserSessionAuthContext | IWorkspaceApiKeyAuthContext | IAdminApiKeyAuthContext