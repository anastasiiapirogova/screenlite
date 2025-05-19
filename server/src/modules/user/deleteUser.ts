import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../../config/prisma.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { findUserById } from './utils/findUserById.js'

const validation = z.object({
    userId: z.string().uuid('User ID must be a valid UUID')
})

export const deleteUser = async (req: Request, res: Response) => {
    const parsedData = validation.safeParse(req.body)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { userId } = parsedData.data

    const user = await findUserById(userId)

    if (!user) {
        return ResponseHandler.notFound(res)
    }

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            deletedAt: new Date()
        }
    })

    ResponseHandler.json(res)
}
