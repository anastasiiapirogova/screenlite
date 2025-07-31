import { User as PrismaUser } from '@/generated/prisma/client.ts'
import { User } from '../entities/user.entity.ts'
import { UserRole } from '../enums/user-role.enum.ts'

export class PrismaRepositoryUserMapper {
    static toDomain(prismaUser: PrismaUser): User {
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
            version: prismaUser.version,
        })
    }

    static toPersistence(user: User): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
        return {
            id: user.id,
            email: user.email,
            pendingEmail: user.pendingEmail,
            name: user.name,
            password: user.password,
            passwordUpdatedAt: user.passwordUpdatedAt,
            totpSecret: user.totpSecret,
            twoFactorEnabled: user.twoFactorEnabled,
            profilePhoto: user.profilePhoto,
            emailVerifiedAt: user.emailVerifiedAt,
            deletionRequestedAt: user.deletionRequestedAt,
            deletedAt: user.deletedAt,
            role: user.role,
            version: user.version,
        }
    }
}