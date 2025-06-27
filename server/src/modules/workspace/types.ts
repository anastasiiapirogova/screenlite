import { Workspace } from '@/generated/prisma/client.ts'

export type UpdateWorkspaceData = {
	name?: string
	slug?: string
	picture?: string
}

export type WorkspaceWithCurrentUser = Workspace & {
	currentUserAccess: {
		role: string
		permissions: Record<string, boolean>
	}
}