import { User as PrismaUser } from '@/generated/prisma/client.ts'
import { User } from '@/core/entities/user.entity.ts'
import { UserRole } from '@/core/enums/user-role.enum.ts'

type ToPersistenceUserData = Omit<PrismaUser, 'createdAt' | 'updatedAt'>

export class PrismaRepositoryUserMapper {
    static toDomain(prismaUser: PrismaUser): User {
        return new User({
            id: prismaUser.id,
            email: prismaUser.email,
            pendingEmail: prismaUser.pendingEmail,
            name: prismaUser.name,
            profilePhotoPath: prismaUser.profilePhotoPath,
            emailVerifiedAt: prismaUser.emailVerifiedAt,
            deletionRequestedAt: prismaUser.deletionRequestedAt,
            deletedAt: prismaUser.deletedAt,
            role: prismaUser.role as UserRole,
            version: prismaUser.version,
        })
    }

    static toPersistence(user: User): ToPersistenceUserData {
        return {
            id: user.id,
            email: user.email,
            pendingEmail: user.pendingEmail,
            name: user.name,
            profilePhotoPath: user.profilePhotoPath,
            emailVerifiedAt: user.emailVerifiedAt,
            deletionRequestedAt: user.deletionRequestedAt,
            deletedAt: user.deletedAt,
            role: user.role,
            version: user.version,
        }
    }
}