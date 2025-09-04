import { IAdminPermissionRepository } from '@/modules/admin-permission/domain/ports/admin-permission-repository.interface.ts'
import { AdminPermissionFactory } from '@/modules/admin-permission/domain/services/admin-permission.factory.ts'
import { SYSTEM_ADMIN_PERMISSIONS, SYSTEM_ADMIN_PERMISSIONS_DEFINITIONS } from '@/modules/admin-permission/domain/definitions/admin-permission.definitions.ts'

export class SyncAdminPermissionsUseCase {
    constructor(
        private readonly permissionRepo: IAdminPermissionRepository,
    ) {}

    async execute(): Promise<void> {
        for (const permission of SYSTEM_ADMIN_PERMISSIONS_DEFINITIONS) {
            const existingPermission = await this.permissionRepo.findByName(permission.name)

            if (!existingPermission) {
                const newPermission = AdminPermissionFactory.create(permission.name, permission.description)

                await this.permissionRepo.upsert(newPermission)
            } else {
                existingPermission.setDescription(permission.description)
                await this.permissionRepo.upsert(existingPermission)
            }
        }

        const allPermissions = await this.permissionRepo.findAll()
        const systemNames = new Set(SYSTEM_ADMIN_PERMISSIONS)

        for (const permission of allPermissions) {
            if (!systemNames.has(permission.name)) {
                await this.permissionRepo.deleteByName(permission.name)
            }
        }
    }
}