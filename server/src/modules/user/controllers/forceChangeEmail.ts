import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { UserRepository } from '../repositories/UserRepository.ts'
import { UserPolicy } from '../policies/userPolicy.ts'
import { changeEmailSchema } from '../schemas/userSchemas.ts'

export const forceChangeEmail = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await changeEmailSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { userId, email } = validation.data

    const userToUpdate = await UserRepository.findUserById(userId)

    if (!userToUpdate) {
        return ResponseHandler.notFound(req, res)
    }

    if (!UserPolicy.canChangeEmail(user, userId)) {
        return ResponseHandler.forbidden(req, res)
    }

    if (userToUpdate.email === email) {
        return ResponseHandler.json(res, {
            user: userToUpdate
        })
    }

    const updatedUser = await UserRepository.updateUserEmail(userId, email)

    ResponseHandler.json(res, {
        user: {
            ...user,
            ...updatedUser
        }
    })
}
