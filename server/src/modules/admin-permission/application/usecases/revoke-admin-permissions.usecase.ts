import { IUserAdminPermissionRepository } from '@/core/ports/user-admin-permission-repository.interface.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'

export class RevokeAdminPermissionsUseCase {
    constructor(
        private readonly userAdminPermissionRepo: IUserAdminPermissionRepository,
    ) {}

    async execute(userId: string, permissionNames: AdminPermissionName[]): Promise<void> {
        for (const permissionName of permissionNames) {
            await this.userAdminPermissionRepo.revokePermissionFromUser(userId, permissionName)
        }
    }
} 