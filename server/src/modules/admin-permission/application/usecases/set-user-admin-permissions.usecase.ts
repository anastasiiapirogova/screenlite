import { IUserAdminPermissionRepository } from '@/modules/admin-permission/domain/ports/user-admin-permission-repository.interface.ts'
import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { AdminPermissionPolicy } from '../../domain/policies/admin-permission.policy.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { NotFoundError } from '@/shared/errors/not-found.error.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'

export class SetUserAdminPermissionsUseCase {
    constructor(
        private readonly userAdminPermissionRepo: IUserAdminPermissionRepository,
        private readonly userRepo: IUserRepository,
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    async execute(authContext: AuthContext, userId: string, permissionNames: AdminPermissionName[]): Promise<{ userId: string, permissions: AdminPermissionName[] }> {
        const targetUser = await this.userRepo.findById(userId)

        if(!targetUser) {
            throw new NotFoundError('USER_NOT_FOUND')
        }

        const currentPermissions = await this.userAdminPermissionRepo.getUserPermissions(userId)

        const adminPermissionPolicy = new AdminPermissionPolicy(authContext)

        adminPermissionPolicy.enforceManageUserPermissions(targetUser, currentPermissions, permissionNames) 
        
        const permissionsToRemove = currentPermissions.filter(
            permission => !permissionNames.includes(permission)
        )
        
        const permissionsToAdd = permissionNames.filter(
            permission => !currentPermissions.includes(permission)
        )
        
        await this.unitOfWork.execute(async (repos) => {
            if (permissionsToRemove.length > 0) {
                await repos.userAdminPermissionRepository.revokePermissionsFromUser(userId, permissionsToRemove)
            }

            if (permissionsToAdd.length > 0) {
                await repos.userAdminPermissionRepository.assignPermissionsToUser(userId, permissionsToAdd)
            }
        })
        
        return {
            userId,
            permissions: permissionNames
        }
    }
} 