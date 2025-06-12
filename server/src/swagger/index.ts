import swaggerJsdoc from 'swagger-jsdoc'
import { APP_VERSION } from '@config/screenlite.js'
import { schemas } from './definitions/schemas.js'
import { responses } from './definitions/responses.js'
import { authPaths } from './paths/auth.js'
import { userPaths } from './paths/user.js'
import { securityPaths } from './paths/security.js'

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