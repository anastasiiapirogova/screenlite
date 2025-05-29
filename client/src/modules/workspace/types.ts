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
	playlists: number
	screens: number
	layouts: number
	files: number
	screenStatus: {
		online: number
		offline: number
		notConnected: number
	}
}

export type UserWorkspace = Workspace & {
	_count: {
		members: number
		screens: number
	}
}

export type WorkspaceWithEntityCounts = Workspace & { _count: WorkspaceEntityCounts } 