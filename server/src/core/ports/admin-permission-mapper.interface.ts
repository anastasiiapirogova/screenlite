import { AdminPermissionDTO } from '@/core/dto/admin-permission.dto.ts'
import { AdminPermission } from '@/generated/prisma/client.ts'

export interface IAdminPermissionMapper {
    toDTO(entity: AdminPermission): AdminPermissionDTO
}