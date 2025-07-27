import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { IAuthContext } from './auth-context.interface.ts'
import { User } from '../entities/user.entity.ts'

export interface IAuthorizationService {
    get authContext(): IAuthContext
    setAuthContext(context: IAuthContext | null): void
    isAuthenticated(): boolean
    isUserContext(): boolean
    currentUser(): User | null
    isAdmin(): boolean
    isSuperAdmin(): boolean
    hasAdminAccess(): boolean
    hasAdminPermission(
        actorPermissions: AdminPermissionName[] | null,
        requiredPermissions: AdminPermissionName | AdminPermissionName[]
    ): boolean
}