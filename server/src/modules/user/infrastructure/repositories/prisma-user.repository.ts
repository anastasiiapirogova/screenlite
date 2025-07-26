import { User } from '@/core/entities/user.entity.ts'
import { Prisma, User as PrismaUser } from '@/generated/prisma/client.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { PrismaClient } from '@/generated/prisma/client.ts'
import { PrismaRepositoryUserMapper } from '@/core/mapper/prisma-repository-user.mapper.ts'

export class PrismaUserRepository implements IUserRepository {
    constructor(
        private readonly prisma: PrismaClient | Prisma.TransactionClient,
    ) {}

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id } })

        return user ? this.toDomain(user) : null
    }

    async findByEmail(email: string): Promise<User | null> {
        const where: Prisma.UserWhereInput = {
            email: {
                equals: email,
                mode: 'insensitive',
            },
        }

        const user = await this.prisma.user.findFirst({ where })

        return user ? this.toDomain(user) : null
    }

    async save(user: User): Promise<void> {
        const userData = this.toPersistence(user)

        const where: Prisma.UserUpsertArgs['where'] = {
            id: userData.id,
        }

        await this.prisma.user.upsert({
            where,
            create: userData,
            update: userData,
        })
    }

    async clearPendingEmails(email: string): Promise<void> {
        await this.prisma.user.updateMany({
            where: { email },
            data: { pendingEmail: null },
        })
    }

    private toDomain(prismaUser: PrismaUser): User {
        return PrismaRepositoryUserMapper.toDomain(prismaUser)
    }

    private toPersistence(user: User): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
        return PrismaRepositoryUserMapper.toPersistence(user)
    }
}