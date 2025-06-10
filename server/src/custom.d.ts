import { WorkspaceRole } from '@modules/workspace/constants/permissions.ts'
import { Workspace } from 'generated/prisma/client.ts'
import { AuthUser } from 'types.ts'

declare global {
	namespace Express {
		interface Request {
			user?: AuthUser
			workspace?: Workspace & {
				permissions: Record<WorkspacePermission, boolean>
				role: WorkspaceRole | null
			}
			token?: string
		}
	}
}

export {}