import { workspaceNameSchema, workspaceSlugSchema } from '@/shared/schemas/workspace.schemas.ts'
import z from 'zod'

export const UpdateWorkspaceSchema = z.object({
    name: workspaceNameSchema,
    slug: workspaceSlugSchema,
    picture: z.instanceof(Buffer).optional(),
    removePicture: z.boolean().optional(),
})

export type UpdateWorkspaceRequestData = z.infer<typeof UpdateWorkspaceSchema>