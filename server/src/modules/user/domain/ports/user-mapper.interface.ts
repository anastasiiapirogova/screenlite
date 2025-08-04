import { User } from '@/core/entities/user.entity.ts'
import { UserDTO } from '@/shared/dto/user.dto.ts'
import { PublicUserDTO } from '@/shared/dto/public-user.dto.ts'

export interface IUserMapper {
    toDTO(entity: User): UserDTO
    toPublicDTO(entity: User): PublicUserDTO
}