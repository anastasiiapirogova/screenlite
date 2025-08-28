import { SignupUsecase } from '@/modules/auth/application/usecases/signup.usecase.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { signupSchema } from '../schemas/signup.schema.ts'
import { FastifyRequestAdapter } from '@/infrastructure/http/adapters/fastify-request.adapter.ts'
import { UserMapper } from '@/modules/user/infrastructure/mappers/user.mapper.ts'

export const signupRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/signup', {
        schema: {
            body: signupSchema,
        },
        config: {
            allowGuest: true,
        }
    }, async (request, reply) => {
        const requestAdapter = new FastifyRequestAdapter(request)
        const userMapper = new UserMapper()

        const signup = new SignupUsecase({
            userRepository: fastify.userRepository,
            sessionRepository: fastify.sessionRepository,
            sessionTokenService: fastify.sessionTokenService,
            passwordHasher: fastify.secureHasher,
            unitOfWork: fastify.unitOfWork,
            userCredentialRepository: fastify.userCredentialRepository
        })

        const result = await signup.execute({
            ...request.body,
            userAgent: requestAdapter.getUserAgent(),
            ipAddress: requestAdapter.getIP()
        })

        return reply.status(201).send({ 
            user: userMapper.toPublicDTO(result.user), 
            token: result.token 
        })
    })
}