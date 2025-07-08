import { paginationSchema } from '@/schemas/paginationSchema.ts'
import { z } from 'zod'

export const workspaceUserInvitationsSchema = paginationSchema

export const inviteUserToWorkspaceSchema = z.object({
    email: z.string().email(),
})

export const cancelUserWorkspaceInvitationSchema = z.object({
    workspaceUserInvitationId: z.string(),
})

export const deleteUserWorkspaceInvitationSchema = z.object({
    workspaceUserInvitationId: z.string(),
})

export const acceptUserWorkspaceInvitationSchema = z.object({
    workspaceUserInvitationId: z.string(),
})