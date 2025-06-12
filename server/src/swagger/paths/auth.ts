export const authPaths = {
    '/auth/signup': {
        post: {
            tags: ['Authentication'],
            summary: 'Register a new user',
            description: 'Creates a new user account with the provided information',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/SignupRequest',
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'User successfully created',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    user: {
                                        $ref: '#/components/schemas/User',
                                    },
                                    token: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    $ref: '#/components/responses/ValidationError',
                },
                429: {
                    $ref: '#/components/responses/TooManyRequestsError',
                },
            },
        },
    },
    '/auth/login': {
        post: {
            tags: ['Authentication'],
            summary: 'Login to the application',
            description: 'Authenticates a user and returns a session token',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/LoginRequest',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Successfully authenticated',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    user: {
                                        $ref: '#/components/schemas/User',
                                    },
                                    token: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    $ref: '#/components/responses/ValidationError',
                },
                429: {
                    $ref: '#/components/responses/TooManyRequestsError',
                },
            },
        },
    },
    '/auth/me': {
        get: {
            tags: ['Authentication'],
            summary: 'Get current user information',
            description: 'Returns the current user\'s information based on the session token',
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: 'Current user information',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/User',
                            },
                        },
                    },
                },
                401: {
                    $ref: '#/components/responses/UnauthorizedError',
                },
            },
        },
    },
    '/auth/logout': {
        post: {
            tags: ['Authentication'],
            summary: 'Logout current user',
            description: 'Invalidates the current session token',
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: 'Successfully logged out',
                },
                401: {
                    $ref: '#/components/responses/UnauthorizedError',
                },
            },
        },
    },
} 