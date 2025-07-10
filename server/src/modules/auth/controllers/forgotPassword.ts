import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { forgotPasswordSchema } from '../schemas/authSchemas.ts'
import { UserRepository } from '@/modules/user/repositories/UserRepository.ts'
import { PasswordResetTokenRepository } from '@/modules/passwordResetToken/repositories/PasswordResetTokenRepository.ts'
import { MailJobProducer } from '@/bullmq/producers/MailJobProducer.ts'

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const validation = forgotPasswordSchema.safeParse(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { email } = validation.data

    const user = await UserRepository.findByEmail(email)

    if (!user) {
        return ResponseHandler.validationError(req, res, {
            email: 'USER_NOT_FOUND',
        })
    }

    const { token } = await PasswordResetTokenRepository.createPasswordResetToken(user.id)

    await MailJobProducer.queuePasswordResetEmail({ email, token })

    return ResponseHandler.ok(res)
} 