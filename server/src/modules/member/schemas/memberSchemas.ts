import { z } from 'zod'
import { WORKSPACE_PERMISSIONS, WORKSPACE_ROLES } from '@modules/workspace/constants/permissions.js'

export const workspaceMembersSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
})

export const leaveWorkspaceSchema = z.object({
    workspaceId: z.string().uuid(),
})

export const removeMemberSchema = z.object({
    workspaceId: z.string().uuid(),
    userId: z.string().uuid(),
})

export const updateMemberSchema = z.object({
    workspaceId: z.string().uuid(),
    userId: z.string().uuid(),
    role: z.enum([WORKSPACE_ROLES.OWNER, WORKSPACE_ROLES.ADMIN, WORKSPACE_ROLES.MEMBER]).optional(),
    permissions: z.array(z.enum(Object.values(WORKSPACE_PERMISSIONS) as [string, ...string[]])).optional(),
})