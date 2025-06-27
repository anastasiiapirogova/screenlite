import swaggerJsdoc from 'swagger-jsdoc'
import { APP_VERSION } from '@/config/screenlite.ts'
import { schemas } from './definitions/schemas.ts'
import { responses } from './definitions/responses.ts'
import { authPaths } from './paths/auth.ts'
import { userPaths } from './paths/user.ts'
import { securityPaths } from './paths/security.ts'

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Screenlite CMS API Documentation',
            version: APP_VERSION,
            description: 'API documentation for Screenlite CMS',
        },
        servers: [
            {
                url: '/api',
                description: 'API server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'opaque',
                    description: 'Enter your bearer token in the format "Bearer {token}"',
                },
            },
            schemas,
            responses,
        },
        paths: {
            ...authPaths,
            ...userPaths,
            ...securityPaths,
        },
    },
    apis: [],
}

export const specs = swaggerJsdoc(options) 