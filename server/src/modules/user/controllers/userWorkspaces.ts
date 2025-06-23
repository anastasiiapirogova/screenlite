import { Request, Response } from 'express'
import { Prisma } from '@/generated/prisma/client.js'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { prisma } from '@/config/prisma.js'
import { userWorkspacesSchema } from '../schemas/userSchemas.js'
import { UserPolicy } from '../policies/userPolicy.js'

export const userWorkspaces = async (req: Request, res: Response) => {
    const { userId } = req.params
    const user = req.user!

    const allowed = UserPolicy.canViewUserWorkspaces(user, userId)

    if (!allowed) {
        return ResponseHandler.forbidden(req, res)
    }

    const parsedData = userWorkspacesSchema.safeParse(req.query)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { page, limit, search } = parsedData.data

    const [workspaces, total] = await Promise.all([
        prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId
                    }
                },
                name: search ? {
                    contains: search,
                } : Prisma.skip,
                deletedAt: null
            },
            orderBy: {
                name: 'asc'
            },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                _count: {
                    select: {
                        members: true,
                        screens: true
                    }
                }
            }
        }),
        prisma.workspace.count({
            where: {
                members: {
                    some: {
                        userId
                    }
                },
                name: search ? {
                    contains: search,
                } : Prisma.skip
            }
        })
    ])

    return ResponseHandler.json(res, {
        workspaces,
        page,
        limit,
        total
    })
}