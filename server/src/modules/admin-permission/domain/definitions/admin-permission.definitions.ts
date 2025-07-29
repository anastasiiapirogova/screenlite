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
] as const