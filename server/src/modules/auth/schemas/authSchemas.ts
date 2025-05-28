import { UserRepository } from '@modules/user/repositories/UserRepository.js'
import { passwordZodSchema } from '@modules/user/schemas/passwordSchema.js'
import { userNameSchema } from '@modules/user/schemas/userSchemas.js'
import { z } from 'zod'

export const signupSchema = z.object({
    email: z.string()
        .email('Invalid email address')
        .refine(async (email) => {
            const doesUserExist = await UserRepository.findUserByEmail(email)

            return !doesUserExist
        }, 'This email is already in our database'),
    name: userNameSchema,
    password: passwordZodSchema,
})