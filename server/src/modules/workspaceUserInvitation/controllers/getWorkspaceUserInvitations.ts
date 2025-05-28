import { Request, Response } from 'express'
import { prisma } from '../../../config/prisma.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { workspaceUserInvitationsSchema } from '../schemas/workspaceUserInvitationSchemas.js'
import { WorkspaceUserInvitationPolicy } from '../policies/WorkspaceUserInvitationPolicy.js'

export const getWorkspaceUserInvitations = async (req: Request, res: Response) => {
    const user = req.user!
    const { slug } = req.params

    const validation = workspaceUserInvitationsSchema.safeParse(req.query)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { page, limit } = validation.data

    const workspace = await prisma.workspace.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            userInvitations: {
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: 'asc',
                },
            },
            _count: {
                select: {
                    userInvitations: true,
                }
            },
        }
    })

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await WorkspaceUserInvitationPolicy.canViewInvitations(user, workspace.id)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const total = workspace._count.userInvitations
    const pages = Math.ceil(total / limit)

    ResponseHandler.json(res, {
        data: workspace.userInvitations,
        meta: {
            page,
            limit,
            pages,
            total,
        },
    })
}
