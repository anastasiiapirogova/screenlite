import { Request, Response } from 'express'
import { z } from 'zod'
import { checkEmailVerificationToken } from '../utils/emailVerificationToken.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { prisma } from '@config/prisma.js'
import { exclude } from '@utils/exclude.js'

const validateToken = z.object({
    token: z.string().min(1, 'Token is required'),
})

const updateUserEmail = (userId: string, newEmail: string | undefined) => {
    return prisma.user.update({
        where: { id: userId },
        data: {
            email: newEmail,
            emailVerifiedAt: new Date()
        },
    })
}

const deleteVerificationTokens = (userId: string) => {
    return prisma.emailVerificationToken.deleteMany({
        where: {
            userId,
        },
    })
}

const isNewEmailTaken = async (newEmail: string) => {
    const user = await UserRepository.findUserByEmail(newEmail)

    return !!user
}

export const verifyEmail = async (req: Request, res: Response) => {
    const validation = await validateToken.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { token } = validation.data

    const tokenRecord = await checkEmailVerificationToken(token)

    if (!tokenRecord) {
        return ResponseHandler.validationError(req, res, { token: 'Token not found' })
    }

    const newEmail = tokenRecord.newEmail || undefined

    if (newEmail && await isNewEmailTaken(newEmail)) {
        await deleteVerificationTokens(tokenRecord.userId)
        return ResponseHandler.validationError(req, res, { email: 'Email is already taken' })
    }

    const [user] = await prisma.$transaction([
        updateUserEmail(tokenRecord.userId, newEmail),
        deleteVerificationTokens(tokenRecord.userId),
    ])

    res.status(200).json({
        user: exclude(user, ['password']),
    })
}
