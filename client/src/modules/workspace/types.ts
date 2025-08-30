export type Workspace = {
	status: string
	id: string
	name: string
	createdAt: string
	updatedAt: string
	slug: string
	picture: string | null
}

export type WorkspaceEntityCounts = {
	members: number
	playlists: number
	screens: number
	layouts: number
	files: number
	screenStatus: {
		online: number
		offline: number
		notConnected: number
	}
	invitations: {
		all: number
		pending: number
	}
}

export type WorkspaceMembershipWithWorkspaceView = {
	membershipId: string
    workspace: {
        id: string
        name: string
        slug: string
        picturePath: string | null
    }
}

export type WorkspaceWithEntityCounts = Workspace & { _count: WorkspaceEntityCounts } 