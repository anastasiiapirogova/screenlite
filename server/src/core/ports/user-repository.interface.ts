import { User } from '../entities/user.entity.ts'

export interface IUserRepository {
    findById(id: string): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    save(user: User): Promise<void>
    clearPendingEmails(email: string): Promise<void>
}