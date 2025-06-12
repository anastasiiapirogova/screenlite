export const userPaths = {
    '/users/{id}': {
        patch: {
            tags: ['User Management'],
            summary: 'Update user profile',
            description: 'Updates user profile information',
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'User ID',
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            $ref: '#/components/schemas/UpdateUserRequest',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'User updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/User',
                            },
                        },
                    },
                },
                400: {
                    $ref: '#/components/responses/ValidationError',
                },
                401: {
                    $ref: '#/components/responses/UnauthorizedError',
                },
                403: {
                    $ref: '#/components/responses/ForbiddenError',
                },
            },
        },
        delete: {
            tags: ['User Management'],
            summary: 'Delete user',
            description: 'Permanently deletes a user account',
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'User ID',
                },
            ],
            responses: {
                200: {
                    description: 'User deleted successfully',
                },
                401: {
                    $ref: '#/components/responses/UnauthorizedError',
                },
                403: {
                    $ref: '#/components/responses/ForbiddenError',
                },
            },
        },
    },
    '/users/{id}/changePassword': {
        post: {
            tags: ['User Management'],
            summary: 'Change user password',
            description: 'Changes the user\'s password',
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'User ID',
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ChangePasswordRequest',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Password changed successfully',
                },
                400: {
                    $ref: '#/components/responses/ValidationError',
                },
                401: {
                    $ref: '#/components/responses/UnauthorizedError',
                },
                403: {
                    $ref: '#/components/responses/ForbiddenError',
                },
            },
        },
    },
    '/users/{id}/changeEmail': {
        post: {
            tags: ['User Management'],
            summary: 'Change user email',
            description: 'Changes the user\'s email address',
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'User ID',
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ChangeEmailRequest',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Email changed successfully',
                },
                400: {
                    $ref: '#/components/responses/ValidationError',
                },
                401: {
                    $ref: '#/components/responses/UnauthorizedError',
                },
                403: {
                    $ref: '#/components/responses/ForbiddenError',
                },
            },
        },
    },
    '/users/{id}/sessions': {
        get: {
            tags: ['Sessions'],
            summary: 'Get user sessions',
            description: 'Returns all active sessions for a user',
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'User ID',
                },
            ],
            responses: {
                200: {
                    description: 'List of user sessions',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/components/schemas/Session',
                                },
                            },
                        },
                    },
                },
                401: {
                    $ref: '#/components/responses/UnauthorizedError',
                },
                403: {
                    $ref: '#/components/responses/ForbiddenError',
                },
            },
        },
    },
    '/users/{id}/workspaces': {
        get: {
            tags: ['Workspaces'],
            summary: 'Get user workspaces',
            description: 'Returns all workspaces the user is a member of',
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'User ID',
                },
            ],
            responses: {
                200: {
                    description: 'List of user workspaces',
                },
                401: {
                    $ref: '#/components/responses/UnauthorizedError',
                },
                403: {
                    $ref: '#/components/responses/ForbiddenError',
                },
            },
        },
    },
    '/users/{id}/invitations': {
        get: {
            tags: ['Workspaces'],
            summary: 'Get user workspace invitations',
            description: 'Returns all pending workspace invitations for the user',
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'User ID',
                },
            ],
            responses: {
                200: {
                    description: 'List of workspace invitations',
                },
                401: {
                    $ref: '#/components/responses/UnauthorizedError',
                },
                403: {
                    $ref: '#/components/responses/ForbiddenError',
                },
            },
        },
    },
} 