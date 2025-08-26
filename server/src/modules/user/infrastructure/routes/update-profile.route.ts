import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import multipart from '@fastify/multipart'
import { UpdateProfileSchema } from '../schemas/update-profile.schema.ts'
import { UpdateProfileUsecase } from '../../application/usecases/update-profile.usecase.ts'
import { PrismaUserRepository } from '../repositories/prisma-user.repository.ts'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { SharpImageValidator } from '@/shared/infrastructure/services/sharp-image-validator.service.ts'
import { SharpImageProcessor } from '@/shared/infrastructure/services/sharp-image-processor.service.ts'
import { UserMapper } from '../mappers/user.mapper.ts'
import { PrismaUnitOfWork } from '@/infrastructure/database/prisma-unit-of-work.ts'
import { userNameSchema } from '@/shared/schemas/user.schemas.ts'

// Prefix: /api/user
export const updateProfileRoute = async (fastify: FastifyInstance) => {
    await fastify.register(multipart)

    fastify.withTypeProvider<ZodTypeProvider>().patch('/:userId/profile', {
        schema: {
            params: z.object({
                userId: z.string()
            })
        }
    }, async (request, reply) => {    
        const multipartData = await fastify.validateMultipart(request, z.object({
            name: userNameSchema,
            removeProfilePhoto: z.stringbool().optional()
        }), {
            profilePhoto: {
                maxFileSize: 1024 * 1024 * 5,
                optional: true
            }
        })

        const { profilePhoto, name, removeProfilePhoto } = UpdateProfileSchema.parse(multipartData)

        const updateProfileUsecase = new UpdateProfileUsecase({
            storage: fastify.storage,
            userRepository: new PrismaUserRepository(fastify.prisma),
            imageValidator: new SharpImageValidator(),
            imageProcessor: new SharpImageProcessor(),
            unitOfWork: new PrismaUnitOfWork(fastify.prisma),
            jobProducer: fastify.jobProducer,
            userMapper: new UserMapper()
        })

        const result = await updateProfileUsecase.execute({
            userId: request.params.userId,
            name,
            profilePhotoBuffer: profilePhoto,
            removeProfilePhoto,
            authContext: request.auth
        })

        return reply.status(200).send({
            message: 'Profile updated successfully',
            data: result
        })
    })
}