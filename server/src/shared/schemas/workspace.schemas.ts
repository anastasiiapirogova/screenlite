import { z } from 'zod'
import { WORKSPACE_NAME_RULES } from '../validation/workspace-name.rules.ts'

const reservedWorkspaceSlugs = [
    'create'
]

export const workspaceNameSchema = z.string()
    .min(WORKSPACE_NAME_RULES.minLength, 'NAME_TOO_SHORT')
    .max(WORKSPACE_NAME_RULES.maxLength, 'NAME_TOO_LONG')

export const workspaceSlugSchema = z.string()
    .min(3, 'SLUG_TOO_SHORT')
    .max(30, 'SLUG_TOO_LONG')
    .regex(/^[a-z0-9-]+$/, 'SLUG_INVALID_CHARACTERS')
    .refine(
        (value) => !value.startsWith('-') && !value.endsWith('-'),
        'SLUG_INVALID_CHARACTERS'
    )
    .refine(
        (value) => !value.includes('--'),
        'SLUG_INVALID_CHARACTERS'
    )
    .refine(
        (value) => !reservedWorkspaceSlugs.includes(value),
        'SLUG_RESERVED'
    )