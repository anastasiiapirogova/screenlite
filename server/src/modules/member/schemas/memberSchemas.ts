import { paginationSchema } from '@/schemas/paginationSchema.ts'
import { z } from 'zod'

export const workspaceMembersSchema = paginationSchema.extend({
    search: z.string().optional(),
})

export const removeMemberSchema = z.object({
    userId: z.string().uuid(),
})

// TODO: add permissions
export const updateMemberSchema = z.object({
    userId: z.string().uuid(),
    role: z.enum(['owner']).optional(),
    permissions: z.array(z.string()).optional(),
})