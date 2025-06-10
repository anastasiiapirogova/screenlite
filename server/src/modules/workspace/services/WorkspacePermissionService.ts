import { UserWorkspace } from 'generated/prisma/client.js'
import { WORKSPACE_PERMISSIONS, getAllPermissionsWithImplied, WorkspacePermission, WORKSPACE_ROLES, WorkspaceRole } from '../constants/permissions.js'

export type UserWorkspacePermissionResult = {
    role: WorkspaceRole | null
    permissions: Record<WorkspacePermission, boolean>
    hasAccess: boolean
    can: (permission: WorkspacePermission) => boolean
}

export class WorkspacePermissionService {
    private static getDefaultAdminPermissions(): WorkspacePermission[] {
        const excludedPermissions: WorkspacePermission[] = [
            WORKSPACE_PERMISSIONS.ADD_ADMINS,
            WORKSPACE_PERMISSIONS.DELETE_WORKSPACE
        ]

        return Object.values(WORKSPACE_PERMISSIONS).filter(
            permission => !excludedPermissions.includes(permission)
        ) as WorkspacePermission[]
    }

    private static getDefaultMemberPermissions(): WorkspacePermission[] {
        return [WORKSPACE_PERMISSIONS.VIEW_WORKSPACE]
    }

    private static createPermissionStatuses(defaultValue: boolean): Record<WorkspacePermission, boolean> {
        return Object.values(WORKSPACE_PERMISSIONS).reduce<Record<WorkspacePermission, boolean>>((acc, permission) => ({
            ...acc,
            [permission]: defaultValue
        }), {} as Record<WorkspacePermission, boolean>)
    }

    private static createPermissionStatusesFromList(permissionList: WorkspacePermission[]): Record<WorkspacePermission, boolean> {
        return Object.values(WORKSPACE_PERMISSIONS).reduce<Record<WorkspacePermission, boolean>>((acc, permission) => ({
            ...acc,
            [permission]: permissionList.includes(permission)
        }), {} as Record<WorkspacePermission, boolean>)
    }

    private static createNoAccessResult(): UserWorkspacePermissionResult {
        const permissions = this.createPermissionStatuses(false)

        return {
            role: null,
            permissions,
            hasAccess: false,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            can: (permission: WorkspacePermission) => false
        }
    }

    private static createOwnerResult(role: string): UserWorkspacePermissionResult {
        const permissions = this.createPermissionStatuses(true)

        return {
            role: role as WorkspaceRole,
            permissions,
            hasAccess: true,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            can: (permission: WorkspacePermission) => true
        }
    }

    private static createAdminResult(workspaceMember: UserWorkspace): UserWorkspacePermissionResult {
        const defaultPermissions = getAllPermissionsWithImplied(this.getDefaultAdminPermissions())
        const additionalPermissions = getAllPermissionsWithImplied(workspaceMember.permissions as WorkspacePermission[])
        const allPermissions = Array.from(new Set([...defaultPermissions, ...additionalPermissions]))
        const permissions = this.createPermissionStatusesFromList(allPermissions)

        return {
            role: workspaceMember.role as WorkspaceRole,
            permissions,
            hasAccess: true,
            can: (permission: WorkspacePermission) => permissions[permission]
        }
    }

    private static createMemberResult(workspaceMember: UserWorkspace): UserWorkspacePermissionResult {
        const memberPermissions = [...(workspaceMember.permissions as WorkspacePermission[]), ...this.getDefaultMemberPermissions()]
        const allPermissions = getAllPermissionsWithImplied(memberPermissions)
        const permissions = this.createPermissionStatusesFromList(allPermissions)

        return {
            role: workspaceMember.role as WorkspaceRole,
            permissions,
            hasAccess: true,
            can: (permission: WorkspacePermission) => permissions[permission]
        }
    }

    static getUserWorkspacePermissions(workspaceMember: UserWorkspace | undefined): UserWorkspacePermissionResult {
        if (!workspaceMember) {
            return this.createNoAccessResult()
        }

        if (workspaceMember.role === WORKSPACE_ROLES.OWNER) {
            return this.createOwnerResult(workspaceMember.role)
        }

        if (workspaceMember.role === WORKSPACE_ROLES.ADMIN) {
            return this.createAdminResult(workspaceMember)
        }

        return this.createMemberResult(workspaceMember)
    }

    static can(permissions: Record<WorkspacePermission, boolean>, requestedPermission: WorkspacePermission): boolean {
        if(permissions[requestedPermission]) {
            return true
        }

        return false
    }
} 