import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import multipart from '@fastify/multipart'

// Prefix: /api/user
export const updateProfileRoute = async (fastify: FastifyInstance) => {
    await fastify.register(multipart)

    fastify.patch('/:userId/profile', {}, async (request, reply) => {
        const { profilePicture, name } = await fastify.validateMultipart(request, z.object({
            name: z.string(),
        }), {
            profilePicture: {
                maxFileSize: 1024 * 1024 * 5,
            }
        })

        if (profilePicture && Buffer.isBuffer(profilePicture)) {
            reply.header('Content-Type', 'image/jpeg')
            reply.header('Content-Length', profilePicture.length)
            return reply.send(profilePicture)
        }

        return reply.status(200).send({
            message: 'Profile updated successfully',
            data: { name }
        })
    })
}