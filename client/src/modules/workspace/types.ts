export type Workspace = {
	status: string
	id: string
	name: string
	createdAt: string
	updatedAt: string
	slug: string
	picture: string | null
}

export interface WorkspaceStatistics {
    members: number
    playlists: number
    screens: number
    layouts: number
    files: {
        active: number
        trash: number
    }
    invitations: {
        total: number
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

export type WorkspaceWithStatistics = Workspace & { statistics: WorkspaceStatistics } 