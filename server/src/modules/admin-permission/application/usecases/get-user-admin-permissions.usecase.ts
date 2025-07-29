import { IUserAdminPermissionRepository } from '@/core/ports/user-admin-permission-repository.interface.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'

export class GetUserAdminPermissionsUseCase {
    constructor(
        private readonly userAdminPermissionRepo: IUserAdminPermissionRepository,
    ) {}

    async execute(userId: string): Promise<AdminPermissionName[]> {
        const permissions = await this.userAdminPermissionRepo.getUserPermissions(userId)

        return permissions
    }
}