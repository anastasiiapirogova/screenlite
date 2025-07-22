import { User } from '@/core/entities/user.entity.ts'
import { Prisma, User as PrismaUser } from '@/generated/prisma/client.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { PrismaClient } from '@/generated/prisma/client.ts'

export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id } })

        return user ? this.toDomain(user) : null
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive',
                },
            }
        })

        return user ? this.toDomain(user) : null
    }

    async save(user: User): Promise<void> {
        await this.saveWithTransaction(user, this.prisma)
    }

    async saveWithTransaction(user: User, transaction: Prisma.TransactionClient): Promise<void> {
        const userData = this.toPersistence(user)

        await transaction.user.upsert({
            where: {
                id: userData.id,
            },
            create: userData,
            update: userData,
        })
    }

    private toDomain(prismaUser: PrismaUser): User {
        return new User({
            id: prismaUser.id,
            email: prismaUser.email,
            name: prismaUser.name,
            password: prismaUser.password,
            passwordUpdatedAt: prismaUser.passwordUpdatedAt,
            totpSecret: prismaUser.totpSecret,
            twoFactorEnabled: prismaUser.twoFactorEnabled,
            profilePhoto: prismaUser.profilePhoto,
            emailVerifiedAt: prismaUser.emailVerifiedAt,
            deletedAt: prismaUser.deletedAt,
        })
    }

    private toPersistence(user: User): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
        const dto = user.toDTO()

        return {
            id: dto.id,
            email: dto.email,
            name: dto.name,
            password: dto.password,
            passwordUpdatedAt: dto.passwordUpdatedAt,
            totpSecret: dto.totpSecret,
            twoFactorEnabled: dto.twoFactorEnabled,
            profilePhoto: dto.profilePhoto,
            emailVerifiedAt: dto.emailVerifiedAt,
            deletedAt: dto.deletedAt,
        }
    }
}