import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { User } from '@/core/entities/user.entity.ts'
import { IAuthorizationService } from '../ports/authorization-service.interface.ts'

export class AuthorizationService implements IAuthorizationService {
    isAdmin(user: User | null): boolean {
        return !!user?.isAdmin
    }

    isSuperAdmin(user: User | null): boolean {
        return !!user?.isSuperAdmin
    }

    hasAdminAccess(user: User | null): boolean {
        return !!user?.isAdmin || !!user?.isSuperAdmin
    }

    hasAdminPermission(
        userPermissions: AdminPermissionName[] | null,
        requiredPermissions: AdminPermissionName | AdminPermissionName[]
    ): boolean {
        if (!userPermissions) return false
    
        const required = Array.isArray(requiredPermissions)
            ? requiredPermissions
            : [requiredPermissions]

        return required.some(perm => userPermissions.includes(perm))
    }
}