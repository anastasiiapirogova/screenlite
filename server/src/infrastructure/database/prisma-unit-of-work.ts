import { PrismaClient } from '@/generated/prisma/client.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { IUserRepository } from '@/core/ports/user-repository.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { ISessionRepository } from '@/core/ports/session-repository.interface.ts'
import { PrismaSessionRepository } from '@/modules/session/infrastructure/repositories/prisma-session.repository.ts'

export class PrismaUnitOfWork implements IUnitOfWork {
    constructor(private prisma: PrismaClient) {}
  
    async execute<T>(
        fn: (repos: {
            userRepository: IUserRepository
            sessionRepository: ISessionRepository
        }) => Promise<T>
    ): Promise<T> {
        return this.prisma.$transaction(async (tx) => {
            const repos = {
                userRepository: new PrismaUserRepository(tx),
                sessionRepository: new PrismaSessionRepository(tx)
            }
        
            return fn(repos)
        })
    }
}