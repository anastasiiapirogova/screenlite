import { Request, Response } from 'express'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { SafeUser } from 'types.js'
import { prisma } from '@config/prisma.js'

const hasPermission = (user: SafeUser, userId: string): boolean => {
    return user.id === userId
}

const paginationSchema = z.object({
    page: z.preprocess((val) => isNaN(Number(val)) ? 1 : Number(val), z.number().min(1)),
    limit: z.preprocess((val) => isNaN(Number(val)) ? 10 : Number(val), z.number().min(1).max(100)),
    search: z.string().optional()
})

export const userWorkspaces = async (req: Request, res: Response) => {
    const userId = req.params.id
    const user = req.user!

    if (!hasPermission(user, userId)) {
        return ResponseHandler.forbidden(res)
    }

    const parsedData = paginationSchema.safeParse(req.query)

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
                } : Prisma.skip
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