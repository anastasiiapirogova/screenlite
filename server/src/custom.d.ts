import { User } from 'generated/prisma/client.js'

declare global {
	namespace Express {
		interface Request {
			user?: Omit<User, 'password'>
			token?: string
		}
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
    return this.toString()
}