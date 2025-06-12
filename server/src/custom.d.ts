import { WorkspaceWithCurrentUser } from '@modules/workspace/types.ts'
import { AuthUser } from 'types.ts'

declare global {
	namespace Express {
		interface Request {
			user?: AuthUser
			workspace?: WorkspaceWithCurrentUser
			token?: string
		}
	}
}

export {}