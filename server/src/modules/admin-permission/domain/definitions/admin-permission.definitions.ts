import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'

export const SYSTEM_ADMIN_PERMISSIONS_DEFINITIONS = [
    { 
        name: AdminPermissionName.SETTINGS, 
        description: 'View and edit global settings', 
    },
    {
        name: AdminPermissionName.USERS_VIEW,
        description: 'View users',
    },
    {
        name: AdminPermissionName.USERS_EDIT,
        description: 'Edit users',
        dependencies: [
            AdminPermissionName.USERS_VIEW
        ],
    },
    {
        name: AdminPermissionName.USERS_DELETE,
        description: 'Delete users',
        dependencies: [
            AdminPermissionName.USERS_VIEW
        ],
    },
    {
        name: AdminPermissionName.USERS_MANAGE_ADMIN_PERMISSIONS,
        description: 'Manage user admin permissions',
        dependencies: [
            AdminPermissionName.USERS_VIEW
        ],
    },
    {
        name: AdminPermissionName.USERS_DISABLE_TWO_FACTOR_AUTH,
        description: 'Disable two factor auth for users',
        dependencies: [
            AdminPermissionName.USERS_VIEW
        ],
    },
    {
        name: AdminPermissionName.SESSIONS_VIEW,
        description: 'View sessions',
    },
    {
        name: AdminPermissionName.WORKSPACES_CREATE,
        description: 'Create workspaces',
        dependencies: [
            AdminPermissionName.WORKSPACES_VIEW
        ],
    },
    {
        name: AdminPermissionName.WORKSPACES_SOFT_DELETE,
        description: 'Soft delete workspaces',
        dependencies: [
            AdminPermissionName.WORKSPACES_VIEW
        ],
    },
    {
        name: AdminPermissionName.WORKSPACES_DELETE,
        description: 'Delete workspaces',
        dependencies: [
            AdminPermissionName.WORKSPACES_VIEW
        ],
    },
    {
        name: AdminPermissionName.WORKSPACES_VIEW,
        description: 'View workspaces',
    },
    {
        name: AdminPermissionName.WORKSPACES_UPDATE,
        description: 'Update workspaces',
        dependencies: [
            AdminPermissionName.WORKSPACES_VIEW
        ],
    },
    {
        name: AdminPermissionName.WORKSPACE_INVITATIONS_VIEW,
        description: 'View workspace invitations',
    },
    {
        name: AdminPermissionName.WORKSPACE_INVITATIONS_CREATE,
        description: 'Create workspace invitations',
        dependencies: [
            AdminPermissionName.WORKSPACE_INVITATIONS_VIEW
        ],
    },
    {
        name: AdminPermissionName.WORKSPACE_INVITATIONS_CANCEL,
        description: 'Cancel workspace invitations',
        dependencies: [
            AdminPermissionName.WORKSPACE_INVITATIONS_VIEW
        ],
    },
] as const

export const SYSTEM_ADMIN_PERMISSIONS = SYSTEM_ADMIN_PERMISSIONS_DEFINITIONS.map(definition => definition.name as AdminPermissionName)