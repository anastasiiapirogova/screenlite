import { User } from '../entities/user.entity.ts'
import { AdminPermissionName } from '../enums/admin-permission-name.enum.ts'

export type IUserAdminPermissionRepository = {
    assignPermissionsToUser(
        userId: string, 
        permissionNames: AdminPermissionName[]
    ): Promise<void>
  
    revokePermissionsFromUser(
        userId: string, 
        permissionNames: AdminPermissionName[]
    ): Promise<void>
  
    getUserPermissions(userId: string): Promise<AdminPermissionName[]>
    userHasPermission(userId: string, permissionName: AdminPermissionName): Promise<boolean>
    getUsersWithPermission(permissionName: AdminPermissionName): Promise<User[]>
}