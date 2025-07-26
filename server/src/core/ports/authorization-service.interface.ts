import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { User } from '@/core/entities/user.entity.ts'

export interface IAuthorizationService {
    isAdmin(user: User | null): boolean
    hasAdminPermission(
        userPermissions: AdminPermissionName[] | null,
        requiredPermissions: AdminPermissionName | AdminPermissionName[]
    ): boolean
}