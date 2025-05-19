import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { workspaceMembersSchema } from '../schemas/memberSchemas.js'
import { prisma } from '@config/prisma.js'
import { memberPolicy } from '../policies/memberPolicy.js'

export const getWorkspaceMembers = async (req: Request, res: Response) => {
    const user = req.user!
    const { slug } = req.params

    const validation = workspaceMembersSchema.safeParse(req.query)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { page, limit, search } = validation.data

    const memberWhereClause: Prisma.UserWorkspaceFindManyArgs = {
        where: {
            user: {
                name: search ? {
                    contains: search,
                    mode: 'insensitive',
                } : Prisma.skip,
            },
        },
    }

    const workspace = await prisma.workspace.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            members: {
                ...memberWhereClause,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    user: {
                        name: 'asc',
                    }
                },
                select: {
                    user: {
                        omit: {
                            emailVerifiedAt: true,
                            password: true,
                            updatedAt: true,
                        }
                    }
                }
            },
            _count: {
                select: {
                    members: {
                        ...memberWhereClause,
                    }
                }
            },
        }
    })

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await memberPolicy.canViewMembers(user, workspace.id)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const total = workspace._count.members
    const pages = Math.ceil(total / limit)

    ResponseHandler.json(res, {
        data: workspace.members,
        meta: {
            page,
            limit,
            pages,
            total,
        },
    })
}
