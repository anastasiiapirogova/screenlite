import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.js'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { workspaceUserInvitationsSchema } from '../schemas/workspaceUserInvitationSchemas.js'
import { PaginationMeta } from '@/types.js'

export const workspaceUserInvitations = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const validation = workspaceUserInvitationsSchema.safeParse(req.query)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { page, limit } = validation.data


    const where = {
        workspaceId: workspace.id,
    }

    const [invitations, total] = await Promise.all([
        prisma.workspaceUserInvitation.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'asc',
            },
        }),
        prisma.workspaceUserInvitation.count({ where })
    ])

    const meta: PaginationMeta = {
        page,
        limit,
        total,
    }

    ResponseHandler.paginated(res, invitations, meta)
}
