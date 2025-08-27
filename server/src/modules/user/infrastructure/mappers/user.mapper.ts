import { PublicUserDTO } from '@/shared/dto/public-user.dto.ts'
import { UserDTO } from '@/shared/dto/user.dto.ts'
import { User } from '@/core/entities/user.entity.ts'
import { IUserMapper } from '../../domain/ports/user-mapper.interface.ts'

export class UserMapper implements IUserMapper {
    toDTO(entity: User): UserDTO {
        return {
            id: entity.id,
            email: entity.email.current,
            pendingEmail: entity.email.pending,
            name: entity.name,
            emailVerifiedAt: entity.email.verifiedAt,
            profilePhotoPath: entity.profilePhotoPath,
            deletionRequestedAt: entity.deletionState.requestedAt,
            deletedAt: entity.deletionState.deletedAt,
            role: entity.role,
            version: entity.version,
        }
    }

    toPublicDTO(entity: User): PublicUserDTO {
        return {
            id: entity.id,
            email: entity.email.current,
            pendingEmail: entity.email.pending,
            name: entity.name,
            emailVerifiedAt: entity.email.verifiedAt,
            profilePhotoPath: entity.profilePhotoPath,
            deletionRequestedAt: entity.deletionState.requestedAt,
            deletedAt: entity.deletionState.deletedAt,
            role: entity.role,
        }
    }
}