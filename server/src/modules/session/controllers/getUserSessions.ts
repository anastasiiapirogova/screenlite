import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { SessionPolicy } from '../policies/sessionPolicy.js'
import { userSessionsSchema } from '../schemas/sessionSchema.js'
import { Prisma } from '@generated/prisma/client.js'
import { prisma } from '@config/prisma.js'
import { parseUserAgent } from '../utils/parseUserAgent.js'

export const getUserSessions = async (req: Request, res: Response) => {
    const { userId } = req.params
    const requestUser = req.user!
    const token = req.token!

    const validation = userSessionsSchema.safeParse(req.query)
	
    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { page, limit, status } = validation.data
	
    let sessionWhereClause: Prisma.SessionFindManyArgs = {}

    if (status) {
        sessionWhereClause = {
            where: {
                terminatedAt: status === 'active' ? null : {
                    not: null,
                },
            },
        }
    } else {
        sessionWhereClause = {
            skip: Prisma.skip,
        }
    }
	
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            sessions: {
                ...sessionWhereClause,
                orderBy: {
                    lastActivityAt: 'desc',
                }
            },
            _count: {
                select: {
                    sessions: {
                        ...sessionWhereClause,
                    }
                }
            },
        }
    })
	
    if (!user) {
        return ResponseHandler.notFound(req, res)
    }

    const allowed = SessionPolicy.canAccessUserSessions(requestUser, userId)

    if (!allowed) {
        return ResponseHandler.forbidden(req, res)
    }

    const safeSessions = user.sessions.map(session => {
        return {
            ...session,
            token: session.token === token ? session.token : undefined,
            userAgent: parseUserAgent(session.userAgent)
        }
    })
	
    const total = user._count.sessions

    const meta = {
        page,
        limit,
        total
    }

    return ResponseHandler.paginated(res, safeSessions, meta)
}