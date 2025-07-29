import { User } from '../entities/user.entity.ts'
import { PaginationResponse } from '../types/pagination.types.ts'
import { UserQueryOptions } from '../types/user-query-options.type.ts'

export interface IUserRepository {
    findById(id: string): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    findAll(queryOptions?: UserQueryOptions): Promise<PaginationResponse<User>>
    save(user: User): Promise<void>
    clearPendingEmails(email: string): Promise<void>
}