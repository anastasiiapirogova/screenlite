export const responses = {
    UnauthorizedError: {
        description: 'Authentication information is missing or invalid',
        content: {
            'text/plain': {
                schema: {
                    type: 'string',
                    example: 'Unauthorized',
                },
            },
        },
    },
    ValidationError: {
        description: 'Validation failed',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        errors: {
                            type: 'object',
                            additionalProperties: {
                                type: 'string',
                            },
                            description: 'Error messages keyed by field name',
                        },
                    },
                },
            },
        },
    },
    TooManyRequestsError: {
        description: 'Too many requests',
        content: {
            'text/plain': {
                schema: {
                    type: 'string',
                    example: 'Too Many Requests',
                },
            },
        },
    },
    ForbiddenError: {
        description: 'Access forbidden',
        content: {
            'text/plain': {
                schema: {
                    type: 'string',
                    example: 'Forbidden',
                },
            },
        },
    },
} 