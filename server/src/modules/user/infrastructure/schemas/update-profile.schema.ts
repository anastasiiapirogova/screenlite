import { userNameSchema } from '@/shared/schemas/user.schemas.ts'
import z from 'zod'

export const UpdateProfileSchema = z.object({
    name: userNameSchema,
    profilePhoto: z.instanceof(Buffer).optional(),
    removeProfilePhoto: z.boolean().optional()
})

export type UpdateProfileRequestData = z.infer<typeof UpdateProfileSchema>