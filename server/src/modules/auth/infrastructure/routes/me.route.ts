import { GetUserUsecase } from '@/modules/user/application/usecases/get-user.usecase.ts'
import { UserMapper } from '@/modules/user/infrastructure/mappers/user.mapper.ts'
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/prisma-user.repository.ts'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const meRoute = async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().get('/me', {
        config: {
            allowSkipTwoFactorAuth: true,
            allowDeletedUser: true,
        }
    }, async (request, reply) => {
        if (!request.auth?.isUserContext()) {
            return fastify.httpErrors.unauthorized()
        }

        const getUserUsecase = new GetUserUsecase({
            userRepository: new PrismaUserRepository(fastify.prisma),
        })

        const user = await getUserUsecase.execute({
            userId: request.auth.user.id,
            authContext: request.auth
        })

        const userMapper = new UserMapper()

        return reply.status(200).send({
            user: userMapper.toPublicDTO(user),
            session: request.auth.session,
        })
    })
}