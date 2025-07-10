import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { resetPasswordSchema } from '../schemas/authSchemas.ts'
import { PasswordResetTokenRepository } from '@/modules/passwordResetToken/repositories/PasswordResetTokenRepository.ts'
import { UserRepository } from '@/modules/user/repositories/UserRepository.ts'

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const validation = resetPasswordSchema.safeParse(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { token, newPassword } = validation.data

    const { userId, isValid } = await PasswordResetTokenRepository.validatePasswordResetToken(token)

    if (!isValid) {
        return ResponseHandler.validationError(req, res, {
            token: 'INVALID_OR_EXPIRED_TOKEN',
        })
    }

    const user = await UserRepository.findUserById(userId)

    if (!user) {
        return ResponseHandler.notFound(req, res)
    }

    await UserRepository.updateUserPassword(userId, newPassword)

    await PasswordResetTokenRepository.deletePasswordResetToken(token)

    return ResponseHandler.ok(res)
}