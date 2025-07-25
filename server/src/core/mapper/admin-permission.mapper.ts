import { AdminPermissionDTO } from '@/core/dto/admin-permission.dto.ts'
import { AdminPermission } from '@/generated/prisma/client.ts'
import { AdminPermissionName } from '../enums/admin-permission-name.enum.ts'

export class AdminPermissionMapper {
    static toDTO(entity: AdminPermission): AdminPermissionDTO {
        return {
            id: entity.id,
            name: entity.name as AdminPermissionName,
            description: entity.description,
        }
    }
}