import { prisma } from '@config/prisma.js'

export class UserRepository {
    static async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: {
                email
            }
        })
    }
}