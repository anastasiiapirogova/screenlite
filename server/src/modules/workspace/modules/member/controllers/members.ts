import { Request, Response } from 'express'
import { Prisma } from '@/generated/prisma/client.js'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { workspaceMembersSchema } from '../schemas/memberSchemas.js'
import { prisma } from '@/config/prisma.js'

export const members = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const validation = workspaceMembersSchema.safeParse(req.query)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { page, limit, search } = validation.data

    const where: Prisma.UserWorkspaceWhereInput = {
        workspaceId: workspace.id,
        user: {
            name: search ? {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
            } : Prisma.skip,
        },
    }

    const [members, total] = await Promise.all([
        prisma.userWorkspace.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                user: {
                    name: 'asc',
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profilePhoto: true,
                    }
                }
            }
        }),
        prisma.userWorkspace.count({ where })
    ])

    const meta = {
        page,
        limit,
        total,
    }

    ResponseHandler.paginated(res, members, meta)
}