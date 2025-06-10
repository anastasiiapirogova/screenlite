export const WORKSPACE_ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    MEMBER: 'member',
} as const

export type WorkspaceRole = typeof WORKSPACE_ROLES[keyof typeof WORKSPACE_ROLES]

export const WORKSPACE_PERMISSIONS = {
    // Workspace management
    UPDATE_WORKSPACE: 'update_workspace',
    DELETE_WORKSPACE: 'delete_workspace',
    VIEW_WORKSPACE: 'view_workspace',

    // Member management
    INVITE_USERS: 'invite_users',
    ADD_ADMINS: 'add_admins',
    VIEW_INVITATIONS: 'view_invitations',
    DELETE_INVITATIONS: 'delete_invitations',
    VIEW_MEMBERS: 'view_members',
    REMOVE_MEMBERS: 'remove_members',
    UPDATE_MEMBERS: 'update_members',
    
    // File and folder management
    CREATE_FILES: 'create_files',
    DELETE_FILES: 'delete_files',
    VIEW_FILES: 'view_files',
    
    // Screen management
    CREATE_SCREENS: 'create_screens',
    UPDATE_SCREENS: 'update_screens',
    DELETE_SCREENS: 'delete_screens',
    VIEW_SCREENS: 'view_screens',
    
    // Playlist management
    CREATE_PLAYLISTS: 'create_playlists',
    DELETE_PLAYLISTS: 'delete_playlists',
    VIEW_PLAYLISTS: 'view_playlists',
    UPDATE_PLAYLISTS: 'update_playlists',
} as const

export const OWNER_ONLY_PERMISSIONS = [
    WORKSPACE_PERMISSIONS.DELETE_WORKSPACE,
] as const

export type WorkspacePermission = typeof WORKSPACE_PERMISSIONS[keyof typeof WORKSPACE_PERMISSIONS]

type PermissionsHierarchy = {
    [K in WorkspacePermission]?: WorkspacePermission[]
}

export const PERMISSIONS_HIERARCHY: PermissionsHierarchy = {
    // Workspace management
    [WORKSPACE_PERMISSIONS.DELETE_WORKSPACE]: [WORKSPACE_PERMISSIONS.VIEW_WORKSPACE],
    [WORKSPACE_PERMISSIONS.UPDATE_WORKSPACE]: [WORKSPACE_PERMISSIONS.VIEW_WORKSPACE],
    
    // Member management
    [WORKSPACE_PERMISSIONS.ADD_ADMINS]: [WORKSPACE_PERMISSIONS.INVITE_USERS],
    [WORKSPACE_PERMISSIONS.INVITE_USERS]: [WORKSPACE_PERMISSIONS.VIEW_INVITATIONS],
    [WORKSPACE_PERMISSIONS.DELETE_INVITATIONS]: [WORKSPACE_PERMISSIONS.VIEW_INVITATIONS],
    [WORKSPACE_PERMISSIONS.REMOVE_MEMBERS]: [WORKSPACE_PERMISSIONS.VIEW_MEMBERS],
    [WORKSPACE_PERMISSIONS.UPDATE_MEMBERS]: [WORKSPACE_PERMISSIONS.VIEW_MEMBERS],
    
    // File and folder management
    [WORKSPACE_PERMISSIONS.CREATE_FILES]: [WORKSPACE_PERMISSIONS.VIEW_FILES],
    [WORKSPACE_PERMISSIONS.DELETE_FILES]: [WORKSPACE_PERMISSIONS.VIEW_FILES],
    
    // Screen management
    [WORKSPACE_PERMISSIONS.CREATE_SCREENS]: [WORKSPACE_PERMISSIONS.VIEW_SCREENS],
    [WORKSPACE_PERMISSIONS.DELETE_SCREENS]: [WORKSPACE_PERMISSIONS.VIEW_SCREENS],
    [WORKSPACE_PERMISSIONS.UPDATE_SCREENS]: [WORKSPACE_PERMISSIONS.VIEW_SCREENS],
    
    // Playlist management
    [WORKSPACE_PERMISSIONS.CREATE_PLAYLISTS]: [WORKSPACE_PERMISSIONS.VIEW_PLAYLISTS],
    [WORKSPACE_PERMISSIONS.DELETE_PLAYLISTS]: [WORKSPACE_PERMISSIONS.VIEW_PLAYLISTS],
    [WORKSPACE_PERMISSIONS.UPDATE_PLAYLISTS]: [WORKSPACE_PERMISSIONS.VIEW_PLAYLISTS],
}

export function getImpliedPermissions(permission: WorkspacePermission): WorkspacePermission[] {
    return PERMISSIONS_HIERARCHY[permission] || []
}

export function getAllPermissionsWithImplied(permissions: WorkspacePermission[]): WorkspacePermission[] {
    const allPermissions = new Set(permissions)
    
    permissions.forEach(permission => {
        const implied = getImpliedPermissions(permission)

        implied.forEach(p => allPermissions.add(p))
    })
    
    return Array.from(allPermissions)
} 