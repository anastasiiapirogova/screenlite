import { AdminPermissionName } from '@/core/enums/admin-permission-name.enum.ts'

export const SYSTEM_ADMIN_PERMISSIONS = [
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
    },
    {
        name: AdminPermissionName.USERS_DELETE,
        description: 'Delete users',
    },
    {
        name: AdminPermissionName.USERS_MANAGE_ADMIN_PERMISSIONS,
        description: 'Manage user admin permissions',
    },
    {
        name: AdminPermissionName.SESSIONS_VIEW,
        description: 'View sessions',
    },
    {
        name: AdminPermissionName.WORKSPACES_CREATE,
        description: 'Create workspaces',
    },
    {
        name: AdminPermissionName.WORKSPACES_SOFT_DELETE,
        description: 'Soft delete workspaces',
    },
    {
        name: AdminPermissionName.WORKSPACES_DELETE,
        description: 'Delete workspaces',
    },
    {
        name: AdminPermissionName.WORKSPACES_VIEW,
        description: 'View workspaces',
    },
    {
        name: AdminPermissionName.WORKSPACES_UPDATE,
        description: 'Update workspaces',
    },
    {
        name: AdminPermissionName.WORKSPACE_INVITATIONS_VIEW,
        description: 'View workspace invitations',
    },
    {
        name: AdminPermissionName.WORKSPACE_INVITATIONS_CREATE,
        description: 'Create workspace invitations',
    },
    {
        name: AdminPermissionName.WORKSPACE_INVITATIONS_CANCEL,
        description: 'Cancel workspace invitations',
    },
] as const