import { WorkspaceRole } from '@/modules/workspace/modules/member/types.ts'
import { WORKSPACE_PERMISSIONS_ARRAY } from '../permissions.ts'
import { WORKSPACE_ROLES_PERMISSIONS } from '../roles.ts'

export class PermissionService {
    static getPermissionsStatus(
        role: WorkspaceRole,
        explicitPermissions: string[] = []
    ): Record<string, boolean> {
        const statusMap: Record<string, boolean> = {}

        for (const permission of WORKSPACE_PERMISSIONS_ARRAY) {
            statusMap[permission] = this.hasPermission(
                role,
                permission,
                explicitPermissions
            )
        }

        return statusMap
    }

    static hasPermission(
        role: WorkspaceRole,
        permission: string,
        explicitPermissions: string[] = []
    ): boolean {
        const rolePermissions = WORKSPACE_ROLES_PERMISSIONS[role]

        if (!rolePermissions) return false

        const { base, denied } = rolePermissions

        if (denied.includes(permission)) {
            return false
        }

        if (base.includes('*')) {
            return true
        }

        for (const basePerm of base) {
            if (basePerm.endsWith('*')) {
                const prefix = basePerm.slice(0, -1)

                if (permission.startsWith(prefix)) {
                    return true
                }
            } else if (basePerm === permission) {
                return true
            }
        }

        if (explicitPermissions.includes(permission)) {
            return true
        }

        return false
    }
}
