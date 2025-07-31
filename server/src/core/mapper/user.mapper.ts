import { PublicUserDTO } from '../dto/public-user.dto.ts'
import { UserDTO } from '../dto/user.dto.ts'
import { User } from '../entities/user.entity.ts'
import { IUserMapper } from '../ports/user-mapper.interface.ts'

export class UserMapper implements IUserMapper {
    toDTO(entity: User): UserDTO {
        return {
            id: entity.id,
            email: entity.email,
            pendingEmail: entity.pendingEmail,
            name: entity.name,
            password: entity.password,
            emailVerifiedAt: entity.emailVerifiedAt,
            passwordUpdatedAt: entity.passwordUpdatedAt,
            profilePhoto: entity.profilePhoto,
            totpSecret: entity.totpSecret,
            twoFactorEnabled: entity.twoFactorEnabled,
            deletionRequestedAt: entity.deletionRequestedAt,
            deletedAt: entity.deletedAt,
            role: entity.role,
            version: entity.version,
        }
    }

    toPublicDTO(entity: User): PublicUserDTO {
        return {
            id: entity.id,
            email: entity.email,
            pendingEmail: entity.pendingEmail,
            name: entity.name,
            role: entity.role,
            emailVerifiedAt: entity.emailVerifiedAt,
            passwordUpdatedAt: entity.passwordUpdatedAt,
            profilePhoto: entity.profilePhoto,
            twoFactorEnabled: entity.twoFactorEnabled,
            deletionRequestedAt: entity.deletionRequestedAt,
            deletedAt: entity.deletedAt,
            version: entity.version,
        }
    }
}