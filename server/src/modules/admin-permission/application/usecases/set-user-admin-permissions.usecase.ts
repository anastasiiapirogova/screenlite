import { IUserAdminPermissionRepository } from '@/core/ports/user-admin-permission-repository.interface.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'

export class SetUserAdminPermissionsUseCase {
    constructor(
        private readonly userAdminPermissionRepo: IUserAdminPermissionRepository,
    ) {}

    async execute(userId: string, permissionNames: AdminPermissionName[]): Promise<{ userId: string, permissions: AdminPermissionName[] }> {
        const currentPermissions = await this.userAdminPermissionRepo.getUserPermissions(userId)
        
        const permissionsToRemove = currentPermissions.filter(
            permission => !permissionNames.includes(permission)
        )
        
        const permissionsToAdd = permissionNames.filter(
            permission => !currentPermissions.includes(permission)
        )
        
        for (const permission of permissionsToRemove) {
            await this.userAdminPermissionRepo.revokePermissionFromUser(userId, permission)
        }
        
        if (permissionsToAdd.length > 0) {
            await this.userAdminPermissionRepo.assignPermissionsToUser(userId, permissionsToAdd)
        }

        return {
            userId,
            permissions: permissionNames
        }
    }
} 