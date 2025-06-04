import { UserRepository } from '@modules/user/repositories/UserRepository.js'
import { passwordZodSchema } from '@modules/user/schemas/passwordSchema.js'
import { userNameSchema } from '@modules/user/schemas/userSchemas.js'
import { z } from 'zod'

const emailSchema = z.string({
    invalid_type_error: 'EMAIL_IS_INVALID',
    required_error: 'EMAIL_IS_REQUIRED'
}).email('EMAIL_IS_INVALID')

export const signupSchema = z.object({
    email: emailSchema.refine(async (email) => {
        const doesUserExist = await UserRepository.findUserByEmail(email)

        return !doesUserExist
    }, 'EMAIL_ALREADY_EXISTS'),
    name: userNameSchema,
    password: passwordZodSchema,
})

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().nonempty('PASSWORD_IS_REQUIRED'),
})