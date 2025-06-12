import { WorkspaceRole } from '../modules/member/types.js'
import { WORKSPACE_PERMISSIONS } from './permissions.js'

export const WORKSPACE_ROLES: Record<string, WorkspaceRole> = {
    OWNER: 'owner',
    ADMIN: 'admin',
    MEMBER: 'member'
}

export const WORKSPACE_ROLES_PERMISSIONS = {
    [WORKSPACE_ROLES.OWNER]: {
        base: [
            '*'
        ],
        denied: [
            WORKSPACE_PERMISSIONS.workspace.leave
        ]
    },
    [WORKSPACE_ROLES.ADMIN]: {
        base: [
            'workspace:*',
            'member:view',
            'member:update',
            'member:remove',
            'invitation:*',
            'screen:*',
            'playlist:*',
            'file:*',
            'folder:*',
            'playlistLayout:*',
            'link:*',
        ],
        denied: [
            WORKSPACE_PERMISSIONS.workspace.delete
        ]
    },
    [WORKSPACE_ROLES.MEMBER]: {
        base: [
            WORKSPACE_PERMISSIONS.workspace.view,
            WORKSPACE_PERMISSIONS.workspace.leave
        ],
        denied: [
            WORKSPACE_PERMISSIONS.workspace.delete,
            WORKSPACE_PERMISSIONS.member.add_admins
        ]
    }
}