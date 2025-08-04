import { AdminPermissionName } from '../../core/enums/admin-permission-name.enum.ts'

export type AdminPermissionDTO = {
    id: string
    name: AdminPermissionName
    description?: string | null
}