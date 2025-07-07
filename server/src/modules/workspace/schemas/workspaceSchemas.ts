import { z } from 'zod'
import { WorkspaceRepository } from '../repositories/WorkspaceRepository.ts'

const reservedSlugs = [
    'create'
]

const workspaceNameSchema = z
    .string({
        invalid_type_error: 'WORKSPACE_NAME_IS_INVALID',
    })
    .max(100, 'WORKSPACE_NAME_IS_TOO_LONG')
    .nonempty('WORKSPACE_NAME_IS_REQUIRED')


export const workspaceSlugSchema = z
    .string({
        invalid_type_error: 'SLUG_IS_INVALID',
        required_error: 'SLUG_IS_REQUIRED'
    })
    .min(3, 'SLUG_IS_TOO_SHORT')
    .refine(async (slug: string) => {
        const doesSlugExist = await WorkspaceRepository.slugExists(slug)

        return !doesSlugExist
    }, 'SLUG_ALREADY_EXISTS')
    .refine((name) => {
        const isReserved = reservedSlugs.some((slug) => slug === name)

        return !isReserved
    }, 'WORKSPACE_NAME_IS_RESERVED')

export const updateWorkspaceSchema = z.object({
    name: workspaceNameSchema.optional(),
    slug: workspaceSlugSchema.optional(),
    picture: z.string().optional()
})

export const workspacePictureSchema = z.object({
    picture: z.object({
        mimetype: z.string().refine((mimetype) => {
            return ['image/jpeg', 'image/png'].includes(mimetype)
        }, 'PICTURE_MUST_BE_JPG_JPEG_PNG'),
        size: z.number().max(5 * 1024 * 1024, 'PICTURE_SIZE_TOO_LARGE')
    })
})

export const createWorkspaceSchema = z.object({
    name: workspaceNameSchema,
    slug: workspaceSlugSchema,
})

export const deleteWorkspaceSchema = z.object({
    confirmationCode: z.string()
        .length(6, 'CONFIRMATION_CODE_MUST_BE_6_CHARACTERS')
        .regex(/^[A-Z0-9]+$/, 'CONFIRMATION_CODE_MUST_BE_UPPERCASE_LETTERS_AND_NUMBERS')
})