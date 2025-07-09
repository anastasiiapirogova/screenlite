import { z } from 'zod'
import { WorkspaceRepository } from '../repositories/WorkspaceRepository.ts'

const reservedSlugs = [
    'create',
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
    .max(32, 'SLUG_IS_TOO_LONG')
    .regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/, 'SLUG_HAS_INVALID_CHARACTERS')
    .refine((slug) => {
        return !slug.startsWith('-') && !slug.endsWith('-')
    }, 'SLUG_CANNOT_START_OR_END_WITH_HYPHEN')
    .refine((slug) => {
        return !slug.includes('--')
    }, 'SLUG_CANNOT_HAVE_CONSECUTIVE_HYPHENS')
    .refine((slug) => {
        return !/^\d+$/.test(slug)
    }, 'SLUG_CANNOT_BE_ONLY_NUMBERS')
    .refine((slug) => {
        const isReserved = reservedSlugs.some((reservedSlug) => slug === reservedSlug)

        return !isReserved
    }, 'SLUG_IS_RESERVED')
    .refine(async (slug) => {
        const doesSlugExist = await WorkspaceRepository.slugExists(slug)

        return !doesSlugExist
    }, 'SLUG_ALREADY_EXISTS')

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