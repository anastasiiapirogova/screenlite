import { Request, Response } from 'express'
import { validatePassword } from '../utils/validatePassword.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { changePasswordSchema } from '../schemas/userSchemas.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { UserPolicy } from '../policies/userPolicy.js'

export const changePassword = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await changePasswordSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { userId, currentPassword, newPassword } = validation.data

    const userToUpdate = await UserRepository.findUserByIdToChangePassword(userId)

    if (!userToUpdate) {
        return ResponseHandler.notFound(res)
    }

    if (!UserPolicy.canChangePassword(user, userId)) {
        return ResponseHandler.forbidden(res)
    }

    const isCurrentPasswordMatched = await validatePassword(currentPassword, userToUpdate.password)

    if (!isCurrentPasswordMatched) {
        return ResponseHandler.validationError(req, res, { currentPassword: 'INCORRECT_PASSWORD' })
    }

    await UserRepository.updateUserPassword(userId, newPassword, req.token)

    ResponseHandler.json(res, {
        message: 'PASSWORD_CHANGED'
    })
}
