import { IAdminPermissionRepository } from '@/core/ports/admin-permission-repository.interface.ts'
import { AdminPermissionFactory } from './admin-permission.factory.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'

export class AdminPermissionDefinitionService {
    private readonly systemPermissions = [
        { 
            name: AdminPermissionName.SETTINGS, 
            description: 'View and edit global settings', 
        },
        {
            name: AdminPermissionName.USERS_VIEW,
            description: 'View users',
        },
        {
            name: AdminPermissionName.USERS_EDIT,
            description: 'Edit users',
        },
        {
            name: AdminPermissionName.USERS_DELETE,
            description: 'Delete users',
        },
    ]

    constructor(
        private readonly permissionRepo: IAdminPermissionRepository,
    ) {}

    async syncPermissions(): Promise<void> {
        for (const permission of this.systemPermissions) {
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

        const systemNames = new Set(this.systemPermissions.map(p => p.name))

        for (const permission of allPermissions) {
            if (!systemNames.has(permission.name)) {
                await this.permissionRepo.deleteByName(permission.name)
            }
        }
    }
}