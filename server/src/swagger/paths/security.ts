export const securityPaths = {
    '/users/2fa/verify': {
        post: {
            tags: ['Two-Factor Authentication'],
            summary: 'Verify 2FA code',
            description: 'Verifies a two-factor authentication code',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/VerifyTwoFaRequest',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: '2FA code verified successfully',
                },
                400: {
                    $ref: '#/components/responses/ValidationError',
                },
                401: {
                    $ref: '#/components/responses/UnauthorizedError',
                },
            },
        },
    },
    '/security/2fa/totpSetupData': {
        get: {
            tags: ['Two-Factor Authentication'],
            summary: 'Get 2FA setup data',
            description: 'Returns the TOTP setup data for enabling 2FA',
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: 'TOTP setup data',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    secret: {
                                        type: 'string',
                                        description: 'TOTP secret key',
                                    },
                                    qrCode: {
                                        type: 'string',
                                        description: 'QR code data URI',
                                    },
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
    '/security/2fa/enable': {
        post: {
            tags: ['Two-Factor Authentication'],
            summary: 'Enable 2FA',
            description: 'Enables two-factor authentication for the user',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/EnableTwoFaRequest',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: '2FA enabled successfully',
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
    '/security/2fa/disable': {
        post: {
            tags: ['Two-Factor Authentication'],
            summary: 'Disable 2FA',
            description: 'Disables two-factor authentication for the user',
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: '2FA disabled successfully',
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
    '/sessions/{id}/terminate': {
        post: {
            tags: ['Sessions'],
            summary: 'Terminate session',
            description: 'Terminates a specific session',
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'Session ID',
                },
            ],
            responses: {
                200: {
                    description: 'Session terminated successfully',
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
    '/users/{id}/terminateAllSessions': {
        post: {
            tags: ['Sessions'],
            summary: 'Terminate all sessions',
            description: 'Terminates all active sessions for the user',
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
                    description: 'All sessions terminated successfully',
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