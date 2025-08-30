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

// Temporary type until we update the API to return the workspace with the entity counts
// export type WorkspaceWithEntityCounts = Workspace & { _count: WorkspaceEntityCounts } 

export type WorkspaceWithEntityCounts = Workspace