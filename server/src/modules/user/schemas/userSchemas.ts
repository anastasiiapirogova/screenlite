import { z } from 'zod'
import { passwordZodSchema } from './passwordSchema.js'
import { paginationSchema } from 'schemas/paginationSchema.js'

export const userNameSchema = z.string().min(1, 'NAME_IS_REQUIRED').max(100, 'NAME_TOO_LONG')

export const changePasswordSchema = z.object({
    userId: z.string().uuid('Invalid userId format. It must be a valid UUID.'),
    currentPassword: z.string(),
    newPassword: passwordZodSchema
})

export const changeEmailSchema = z.object({
    userId: z.string().uuid('Invalid userId format. It must be a valid UUID.'),
    email: z.string().email('Invalid email format')
})

export const userIdSchema = z.object({
    userId: z.string().nonempty('USER_ID_IS_REQUIRED')
})

export const updateUserSchema = z.object({
    name: userNameSchema.optional(),
    profilePhoto: z.string().optional()
})

export const userProfilePhotoSchema = z.object({
    profilePhoto: z.object({
        mimetype: z.string().refine((mimetype) => {
            return ['image/jpeg', 'image/png'].includes(mimetype)
        }, 'PICTURE_MUST_BE_JPG_JPEG_PNG'),
        size: z.number().max(5 * 1024 * 1024, 'LIMIT_FILE_SIZE')
    })
})

export const verifyEmailSchema = z.object({
    token: z.string().nonempty('TOKEN_IS_REQUIRED')
})

export const userWorkspacesSchema = paginationSchema.extend({
    search: z.string().optional(),
})

export const deleteUserSchema = z.object({
    userId: z.string().uuid('User ID must be a valid UUID')
})

export const enableTwoFaSchema = z.object({
    token: z.string().length(6)
})

export const verifyTwoFaSchema = z.object({
    token: z.string().length(6)
})