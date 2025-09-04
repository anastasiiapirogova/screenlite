import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import multipart from '@fastify/multipart'
import { UpdateProfileSchema } from '../schemas/update-profile.schema.ts'
import { UpdateProfileUsecase } from '../../application/usecases/update-profile.usecase.ts'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UserMapper } from '../mappers/user.mapper.ts'

// Prefix: /api/users
export const updateProfileRoute = async (fastify: FastifyInstance) => {
    await fastify.register(multipart)

    fastify.withTypeProvider<ZodTypeProvider>().patch('/:userId/profile', {
        schema: {
            params: z.object({
                userId: z.string()
            })
        }
    }, async (request, reply) => {    
        const multipartData = await fastify.validateMultipart(request, UpdateProfileSchema.omit({ profilePhoto: true }), {
            profilePhoto: {
                maxFileSize: 1024 * 1024 * 5,
                optional: true
            }
        })

        const userMapper = new UserMapper()

        const { profilePhoto, name, removeProfilePhoto } = UpdateProfileSchema.parse(multipartData)

        const updateProfileUsecase = new UpdateProfileUsecase({
            storage: fastify.storage,
            userRepository: fastify.userRepository,
            imageValidator: fastify.imageValidator,
            imageProcessor: fastify.imageProcessor,
            unitOfWork: fastify.unitOfWork,
            jobProducer: fastify.jobProducer
        })

        const result = await updateProfileUsecase.execute({
            userId: request.params.userId,
            name,
            profilePhotoBuffer: profilePhoto,
            removeProfilePhoto,
            authContext: request.auth
        })

        return reply.status(200).send({
            user: userMapper.toPublicDTO(result)
        })
    })
}