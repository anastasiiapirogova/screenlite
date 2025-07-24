import { User } from '@/core/entities/user.entity.ts'
import { Prisma, User as PrismaUser } from '@/generated/prisma/client.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { PrismaClient } from '@/generated/prisma/client.ts'
import { UserRole } from '@/core/enums/user-role.enum.ts'

export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

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
        const userData = this.toPersistence(user)

        await this.prisma.user.upsert({
            where: {
                id: userData.id,
            },
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
        return new User({
            id: prismaUser.id,
            email: prismaUser.email,
            pendingEmail: prismaUser.pendingEmail,
            name: prismaUser.name,
            password: prismaUser.password,
            passwordUpdatedAt: prismaUser.passwordUpdatedAt,
            totpSecret: prismaUser.totpSecret,
            twoFactorEnabled: prismaUser.twoFactorEnabled,
            profilePhoto: prismaUser.profilePhoto,
            emailVerifiedAt: prismaUser.emailVerifiedAt,
            deletionRequestedAt: prismaUser.deletionRequestedAt,
            deletedAt: prismaUser.deletedAt,
            role: prismaUser.role as UserRole,
        })
    }

    private toPersistence(user: User): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
        const dto = user.toDTO()

        return {
            id: dto.id,
            email: dto.email,
            pendingEmail: dto.pendingEmail,
            name: dto.name,
            password: dto.password,
            passwordUpdatedAt: dto.passwordUpdatedAt,
            totpSecret: dto.totpSecret,
            twoFactorEnabled: dto.twoFactorEnabled,
            profilePhoto: dto.profilePhoto,
            emailVerifiedAt: dto.emailVerifiedAt,
            deletionRequestedAt: dto.deletionRequestedAt,
            deletedAt: dto.deletedAt,
            role: dto.role,
        }
    }
}