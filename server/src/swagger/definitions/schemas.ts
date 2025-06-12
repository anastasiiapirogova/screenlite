export const schemas = {
    SignupRequest: {
        type: 'object',
        required: ['email', 'name', 'password'],
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'User email address',
            },
            name: {
                type: 'string',
                description: 'User full name',
            },
            password: {
                type: 'string',
                format: 'password',
                description: 'User password',
            },
        },
    },
    LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'User email address',
            },
            password: {
                type: 'string',
                format: 'password',
                description: 'User password',
            },
        },
    },
    VerifyEmailRequest: {
        type: 'object',
        required: ['token'],
        properties: {
            token: {
                type: 'string',
                description: 'Email verification token',
            },
        },
    },
    ChangePasswordRequest: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
            currentPassword: {
                type: 'string',
                format: 'password',
                description: 'Current user password',
            },
            newPassword: {
                type: 'string',
                format: 'password',
                description: 'New password to set',
            },
        },
    },
    ChangeEmailRequest: {
        type: 'object',
        required: ['email'],
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'New email address',
            },
        },
    },
    UpdateUserRequest: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                description: 'User full name',
            },
            picture: {
                type: 'string',
                format: 'binary',
                description: 'User profile picture',
            },
        },
    },
    VerifyTwoFaRequest: {
        type: 'object',
        required: ['code'],
        properties: {
            code: {
                type: 'string',
                description: 'Two-factor authentication code',
            },
        },
    },
    EnableTwoFaRequest: {
        type: 'object',
        required: ['code'],
        properties: {
            code: {
                type: 'string',
                description: 'Initial TOTP code to verify setup',
            },
        },
    },
    Session: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'Session ID',
            },
            userAgent: {
                type: 'string',
                description: 'User agent string',
            },
            ipAddress: {
                type: 'string',
                description: 'IP address',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Session creation timestamp',
            },
            lastActivityAt: {
                type: 'string',
                format: 'date-time',
                description: 'Last activity timestamp',
            },
        },
    },
    User: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'User ID',
            },
            email: {
                type: 'string',
                format: 'email',
                description: 'User email',
            },
            name: {
                type: 'string',
                description: 'User full name',
            },
            pictureUrl: {
                type: 'string',
                format: 'uri',
                description: 'URL to user profile picture',
            },
            twoFactorEnabled: {
                type: 'boolean',
                description: 'Whether 2FA is enabled',
            },
        },
    },
} 