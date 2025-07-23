import { ISessionRepository } from './session-repository.interface.ts'
import { IUserRepository } from './user-repository.interface.ts'

export type IUnitOfWork = {
    execute<T>(fn: (repos: {
        userRepository: IUserRepository
        sessionRepository: ISessionRepository
    }) => Promise<T>): Promise<T>
}