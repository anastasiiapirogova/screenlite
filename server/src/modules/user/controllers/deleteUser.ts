import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { UserRepository } from '../repositories/UserRepository.ts'
import { deleteUserSchema } from '../schemas/userSchemas.ts'

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
