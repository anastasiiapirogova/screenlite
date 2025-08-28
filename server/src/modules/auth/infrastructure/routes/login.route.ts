import { LoginUsecase } from '@/modules/auth/application/usecases/login.usecase.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { loginSchema } from '../schemas/login.schema.ts'
import { FastifyRequestAdapter } from '@/infrastructure/http/adapters/fastify-request.adapter.ts'
import { UserMapper } from '@/modules/user/infrastructure/mappers/user.mapper.ts'

export const loginRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().post('/login', {
        schema: {
            body: loginSchema,
        },
        config: {
            allowGuest: true
        }
    }, async (request, reply) => {
        const requestAdapter = new FastifyRequestAdapter(request)
        const userMapper = new UserMapper()

        const login = new LoginUsecase({
            userRepository: fastify.userRepository,
            sessionRepository: fastify.sessionRepository,
            passwordHasher: fastify.secureHasher,
            sessionTokenService: fastify.sessionTokenService,
            userCredentialRepository: fastify.userCredentialRepository
        })

        const result = await login.execute({
            ...request.body,
            userAgent: requestAdapter.getUserAgent(),
            ipAddress: requestAdapter.getIP()
        })

        return reply.status(200).send({
            user: userMapper.toPublicDTO(result.user),
            token: result.token
        })
    })
} 