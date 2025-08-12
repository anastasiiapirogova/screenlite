import { PublicUserDTO } from '../../../../shared/dto/public-user.dto.ts'
import { UserDTO } from '../../../../shared/dto/user.dto.ts'
import { User } from '../../../../core/entities/user.entity.ts'
import { IUserMapper } from '../../domain/ports/user-mapper.interface.ts'

export class UserMapper implements IUserMapper {
    toDTO(entity: User): UserDTO {
        return {
            id: entity.id,
            email: entity.email,
            pendingEmail: entity.pendingEmail,
            name: entity.name,
            passwordHash: entity.passwordHash,
            emailVerifiedAt: entity.emailVerifiedAt,
            passwordUpdatedAt: entity.passwordUpdatedAt,
            profilePhotoPath: entity.profilePhotoPath,
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
            profilePhotoPath: entity.profilePhotoPath,
            deletionRequestedAt: entity.deletionRequestedAt,
            deletedAt: entity.deletedAt,
        }
    }
}