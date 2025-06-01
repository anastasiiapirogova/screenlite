import { AuthUser } from 'types.ts'

declare global {
	namespace Express {
		interface Request {
			user?: AuthUser
			token?: string
		}
	}
}

export {}