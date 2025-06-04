import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { SessionPolicy } from '../policies/sessionPolicy.js'
import { userSessionsSchema } from '../schemas/sessionSchema.js'
import { Prisma } from 'generated/prisma/client.js'
import { prisma } from '@config/prisma.js'
import { parseUserAgent } from '../utils/parseUserAgent.js'

export const getUserSessions = async (req: Request, res: Response) => {
    const { id } = req.params
    const requestUser = req.user!
    const token = req.token!

    const validation = userSessionsSchema.safeParse(req.query)
	
    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { page, limit, status } = validation.data
	
    const sessionWhereClause: Prisma.SessionFindManyArgs = {
        where: {
            revokedAt: status === 'active' ? null : {
                not: null,
            },
        },
    }
	
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            sessions: {
                ...sessionWhereClause
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
        return ResponseHandler.notFound(res)
    }

    const allowed = SessionPolicy.canAccessUserSessions(requestUser, user.id)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const safeSessions = user.sessions.map(session => {
        return {
            ...session,
            token: session.token === token ? session.token : undefined,
            userAgent: parseUserAgent(session.userAgent)
        }
    })
	
    const total = user._count.sessions
    const pages = Math.ceil(total / limit)
	
    ResponseHandler.json(res, {
        data: safeSessions,
        meta: {
            page,
            limit,
            pages,
            total,
        },
    })
}