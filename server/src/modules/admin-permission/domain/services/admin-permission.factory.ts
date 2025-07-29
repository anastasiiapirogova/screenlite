import { AdminPermission } from '@/core/entities/admin-permission.entity.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { v4 as uuidv4 } from 'uuid'

export class AdminPermissionFactory {
    static create(name: AdminPermissionName, description?: string): AdminPermission {
        return new AdminPermission(
            uuidv4(),
            name,
            description ?? null,
        )
    }
}