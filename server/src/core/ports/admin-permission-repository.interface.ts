import { AdminPermission } from '../entities/admin-permission.entity.ts'
import { AdminPermissionName } from '../enums/admin-permission-name.enum.ts'

export type IAdminPermissionRepository = {
    upsert(permission: AdminPermission): Promise<AdminPermission>
    findById(id: string): Promise<AdminPermission | null>
    findByName(name: AdminPermissionName): Promise<AdminPermission | null>
    findAll(): Promise<AdminPermission[]>
    deleteByName(name: string): Promise<void>
}