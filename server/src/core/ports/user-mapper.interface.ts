import { User } from '@/core/entities/user.entity.ts'
import { UserDTO } from '@/core/dto/user.dto.ts'
import { PublicUserDTO } from '../dto/public-user.dto.ts'

export interface IUserMapper {
    toDTO(entity: User): UserDTO
    toPublicDTO(entity: User): PublicUserDTO
}