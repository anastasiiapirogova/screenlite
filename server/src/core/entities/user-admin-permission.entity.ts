import { UserAdminPermissionDTO } from '../../shared/dto/user-admin-permission.dto.ts'

export class UserAdminPermissionEntity {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly permissionId: string,
    ) {}

    toDTO(): UserAdminPermissionDTO {
        return {
            id: this.id,
            userId: this.userId,
            permissionId: this.permissionId,
        }
    }
}