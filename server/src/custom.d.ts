import { WorkspaceWithCurrentUser } from '@modules/workspace/types.ts'
import { AuthUser } from 'types.ts'
import i18next from 'i18next'

declare global {
	namespace Express {
		interface Request {
			user?: AuthUser
			workspace?: WorkspaceWithCurrentUser
			token?: string
			t?: typeof i18next.t
		}
	}
}

export {}