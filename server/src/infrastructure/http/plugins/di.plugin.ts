import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { PrismaUserCredentialRepository } from '@/modules/user/infrastructure/repositories/prisma-user-credential.repository.ts'
import { BcryptHasher } from '@/shared/infrastructure/services/bcrypt-hasher.service.ts'
import { PrismaUnitOfWork } from '@/infrastructure/database/prisma-unit-of-work.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { IUserCredentialRepository } from '@/core/ports/user-credential-repository.interface.ts'
import { IHasher } from '@/core/ports/hasher.interface.ts'
import { IUnitOfWork } from '@/core/ports/unit-of-work.interface.ts'
import { SharpImageValidator } from '@/shared/infrastructure/services/sharp-image-validator.service.ts'
import { SharpImageProcessor } from '@/shared/infrastructure/services/sharp-image-processor.service.ts'
import { IImageValidator } from '@/core/ports/image-validator.interface.ts'
import { IImageProcessor } from '@/core/ports/image-processor.interface.ts'

declare module 'fastify' {
    interface FastifyInstance {
        userRepository: IUserRepository
        userCredentialRepository: IUserCredentialRepository
        secureHasher: IHasher
        unitOfWork: IUnitOfWork
        imageValidator: IImageValidator
        imageProcessor: IImageProcessor
    }
}

const diPlugin: FastifyPluginAsync = async (fastify) => {
    const userRepository = new PrismaUserRepository(fastify.prisma)
    const userCredentialRepository = new PrismaUserCredentialRepository(fastify.prisma)
    const secureHasher = new BcryptHasher()
    const unitOfWork = new PrismaUnitOfWork(fastify.prisma)
    const imageValidator = new SharpImageValidator()
    const imageProcessor = new SharpImageProcessor()

    fastify.decorate('userRepository', userRepository)
    fastify.decorate('userCredentialRepository', userCredentialRepository)
    fastify.decorate('secureHasher', secureHasher)
    fastify.decorate('unitOfWork', unitOfWork)
    fastify.decorate('imageValidator', imageValidator)
    fastify.decorate('imageProcessor', imageProcessor)
}

export default fp(diPlugin, {
    name: 'di',
    dependencies: ['prisma'],
})