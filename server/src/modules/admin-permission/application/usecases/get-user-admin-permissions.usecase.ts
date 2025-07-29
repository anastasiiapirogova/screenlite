import { IUserAdminPermissionRepository } from '@/core/ports/user-admin-permission-repository.interface.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { AdminPermissionPolicy } from '../../domain/policies/admin-permission.policy.ts'
import { NotFoundError } from '@/core/errors/not-found.error.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'

export class GetUserAdminPermissionsUseCase {
    constructor(
        private readonly userAdminPermissionRepo: IUserAdminPermissionRepository,
        private readonly userRepo: IUserRepository,
    ) {}

    async execute(authContext: AuthContext, userId: string): Promise<AdminPermissionName[]> {
        const targetUser = await this.userRepo.findById(userId)

        if(!targetUser) {
            throw new NotFoundError('USER_NOT_FOUND')
        }

        const adminPermissionPolicy = new AdminPermissionPolicy(authContext)
        
        adminPermissionPolicy.enforceCanViewUserPermissions(targetUser)

        const permissions = await this.userAdminPermissionRepo.getUserPermissions(userId)

        return permissions
    }
}