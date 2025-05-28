import { prisma } from '@config/prisma.js'
import { hashPassword } from '../utils/hashPassword.js'

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async updateUser(userId: string, data: Record<string, any>) {
        return await prisma.workspace.update({
            where: { id: userId },
            data,
        })
    }

    static async updateUserPassword(userId: string, newPassword: string) {
        const hashedPassword = await hashPassword(newPassword)

        await prisma.user.update({
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

        return true
    }

    static async findUserById(id: string) {
        return await prisma.user.findUnique({
            where: { id },
        })
    }

    static async findUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
        })
    }
}