import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.js'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { deleteUserSchema } from '../schemas/userSchemas.js'

export const deleteUser = async (req: Request, res: Response) => {
    const parsedData = deleteUserSchema.safeParse(req.body)

    if (!parsedData.success) {
        return ResponseHandler.zodError(req, res, parsedData.error.errors)
    }

    const { userId } = parsedData.data

    const user = await UserRepository.findUserById(userId)

    if (!user) {
        return ResponseHandler.notFound(req, res)
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
