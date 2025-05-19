import { Request, Response } from 'express'
import { validatePassword } from './utils/validatePassword.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { hashPassword } from './utils/hashPassword.js'
import { prisma } from '@config/prisma.js'
import { exclude } from '@utils/exclude.js'
import { findUserById } from './utils/findUserById.js'
import { changePasswordSchema } from './schemas/userSchemas.js'
import { userPolicy } from './policies/userPolicy.js'

const updateUserPassword = async (userId: string, newPassword: string) => {
    const hashedPassword = await hashPassword(newPassword)

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            password: hashedPassword,
            sessions: {
                updateMany: {
                    where: {
                        revokedAt: null,
                    },
                    data: {
                        revokedAt: new Date()
                    }
                },
            },
        },
    })

    return exclude(user, ['password'])
}

export const changePassword = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await changePasswordSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { userId, currentPassword, newPassword } = validation.data

    const userToUpdate = await findUserById(userId)

    if (!userToUpdate) {
        return ResponseHandler.notFound(res)
    }

    if (!userPolicy.canDeleteUser(user, userId)) {
        return ResponseHandler.forbidden(res)
    }

    const isCurrentPasswordMatched = await validatePassword(currentPassword, userToUpdate.password)

    if (!isCurrentPasswordMatched) {
        return ResponseHandler.validationError(req, res, { currentPassword: 'INCORRECT_PASSWORD' })
    }

    await updateUserPassword(userId, newPassword)

    ResponseHandler.json(res, {
        message: 'PASSWORD_CHANGED'
    })
}
