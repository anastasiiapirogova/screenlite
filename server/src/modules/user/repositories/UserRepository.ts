import { prisma } from '@config/prisma.js'
import { hashPassword } from '../utils/hashPassword.js'
import { EmailVerificationTokenRepository } from '@modules/emailVerificationToken/repositories/EmailVerificationTokenRepository.js'
import { Prisma } from 'generated/prisma/client.js'
import { SafeUser } from 'types.js'

export class UserRepository {
    static async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: {
                email
            }
        })
    }

    static async createUser(email: string, name: string, password: string) {
        const hashedPassword = await hashPassword(password)

        return await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        })
    }

    static async updateUser(userId: string, data: Prisma.UserUpdateInput): Promise<SafeUser> {
        return await prisma.user.update({
            where: { id: userId },
            data,
        })
    }

    static updateUserEmail(userId: string, email: string | undefined) {
        return prisma.user.update({
            where: { id: userId },
            data: {
                email,
                emailVerifiedAt: new Date()
            },
        })
    }

    static async getUserWithTotpSecret(userId: string) {
        return await prisma.user.findUnique({
            where: { id: userId },
            select: {
                totpSecret: true,
            }
        })
    }

    static async updateUserTotpSecret(userId: string, totpSecret: string | null) {
        return await prisma.user.update({
            where: { id: userId },
            data: {
                totpSecret,
            }
        })
    }

    static async enableTwoFactor(userId: string) {
        return await prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorEnabled: true,
            }
        })
    }

    static async disableTwoFactor(userId: string) {
        return await prisma.user.update({
            where: { id: userId },
            data: {
                totpSecret: null,
                twoFactorEnabled: false,
            }
        })
    }

    static async updateUserEmailTransaction(userId: string, email: string | undefined) {
        const [user] = await prisma.$transaction([
            UserRepository.updateUserEmail(userId, email),
            EmailVerificationTokenRepository.deleteVerificationTokens(userId),
        ])

        return user
    }

    static async updateUserPassword(userId: string, newPassword: string, token?: string) {
        const hashedPassword = await hashPassword(newPassword)

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                passwordUpdatedAt: new Date(),
                sessions: token ? {
                    updateMany: {
                        where: {
                            revokedAt: null,
                            NOT: { token },
                        },
                        data: {
                            revokedAt: new Date()
                        }
                    }
                } : {
                    updateMany: {
                        where: {
                            revokedAt: null,
                        },
                        data: {
                            revokedAt: new Date()
                        }
                    }
                },
            },
        })

        return true
    }

    static async findUserById(id: string) {
        return await prisma.user.findUnique({
            where: { id },
        })
    }

    static async findUserByEmail(email: string) {
        return await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive',
                },
            }
        })
    }

    static async findUserToAuthenticate(email: string) {
        return await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive',
                },
            },
            omit: {
                password: false
            },
        })
    }

    static async findUserByIdToChangePassword(id: string) {
        return await prisma.user.findUnique({
            where: { id },
            omit: {
                password: false
            }
        })
    }
}