import { paginationSchema } from 'schemas/paginationSchema.js'
import { z } from 'zod'

export const workspaceUserInvitationsSchema = paginationSchema.extend({
    workspaceId: z.string().optional(),
})

export const userInvitationsSchema = z.object({
    userId: z.string()
})

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