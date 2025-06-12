export const WORKSPACE_PERMISSIONS = {
    workspace: {
        view: 'workspace:view',
        update: 'workspace:update',
        delete: 'workspace:delete',
        leave: 'workspace:leave'
    },
    member: {
        view: 'member:view',
        update: 'member:update',
        remove: 'member:remove',
        add_admins: 'member:add_admins',
    },
    invitation: {
        view: 'invitation:view',
        create: 'invitation:create',
    },
    screen: {
        view: 'screen:view',
        create: 'screen:create',
        delete: 'screen:delete',
        connect: 'screen:connect',
        update: 'screen:update'
    },
    playlist: {
        view: 'playlist:view',
        create: 'playlist:create',
        update: 'playlist:update',
        delete: 'playlist:delete',
        restore: 'playlist:restore',
        permanentDelete: 'playlist:permanentDelete'
    },
    file: {
        view: 'file:view',
        upload: 'file:upload',
        delete: 'file:delete',
        update: 'file:update',
        permanentDelete: 'file:permanentDelete'
    },
    folder: {
        create: 'folder:create',
        update: 'folder:update',
    },
    playlistLayout: {
        view: 'playlistLayout:view',
        create: 'playlistLayout:create',
        update: 'playlistLayout:update',
        delete: 'playlistLayout:delete'
    },
    link: {
        view: 'link:view',
        create: 'link:create',
        update: 'link:update',
        delete: 'link:delete'
    }
}

export const WORKSPACE_PERMISSIONS_ARRAY = Object.values(WORKSPACE_PERMISSIONS).flatMap(
    (permission) => Object.values(permission)
)