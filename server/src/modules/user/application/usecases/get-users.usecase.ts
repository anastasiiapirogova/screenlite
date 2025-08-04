import { User } from '@/core/entities/user.entity.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { GetUsersDto } from '../dto/get-users.dto.ts'
import { UserListPolicy } from '../../domain/policies/user-list.policy.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'

export class GetUsersUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(dto: GetUsersDto): Promise<PaginationResponse<User>> {
        const userListPolicy = new UserListPolicy(dto.authContext)

        userListPolicy.enforceViewAllUsers()

        return this.userRepository.findAll(dto.queryOptions)
    }
}