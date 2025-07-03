import { z } from 'zod'
import { paginationSchema } from '@/schemas/paginationSchema.ts'

export const fileNameSchema = z
    .string({
        invalid_type_error: 'FILE_NAME_IS_INVALID',
    })
    .nonempty('FILE_NAME_IS_REQUIRED')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateEndAfterStart = (data: any) => {
    const { availabilityStartAt, availabilityEndAt } = data

    if (!availabilityStartAt || !availabilityEndAt) {
        return true
    }
    return new Date(availabilityEndAt) >= new Date(availabilityStartAt)
}

const bothDatesOrNeither = ({ availabilityStartAt, availabilityEndAt }: { availabilityStartAt?: string | null, availabilityEndAt?: string | null }) => {
    return (availabilityStartAt === undefined && availabilityEndAt === undefined) ||
           (availabilityStartAt !== undefined && availabilityEndAt !== undefined)
}

export const updateFileSchema = z.object({
    name: fileNameSchema.max(100, 'FILE_NAME_TOO_LONG').optional(),
    defaultDuration: z.preprocess((val) => Number(val), z.number({
        invalid_type_error: 'FILE_DEFAULT_DURATION_IS_INVALID',
    }).int('FILE_DEFAULT_DURATION_IS_INVALID').positive('FILE_DEFAULT_DURATION_IS_INVALID')).nullable().optional(),
    availabilityStartAt: z.string().datetime({ message: 'AVAILABILITY_START_AT_IS_INVALID' }).nullable().optional(),
    availabilityEndAt: z.string().datetime({ message: 'AVAILABILITY_END_AT_IS_INVALID' }).nullable().optional(),
}).refine(bothDatesOrNeither, {
    message: 'AVAILABILITY_START_AT_AND_END_AT_BOTH_REQUIRED',
    path: ['availabilityStartAt', 'availabilityEndAt'],
}).refine(validateEndAfterStart, {
    message: 'AVAILABILITY_END_AT_BEFORE_START_AT',
    path: ['availabilityEndAt'],
})

export const deleteFilesSchema = z.object({
    fileIds: z.array(z.string().nonempty('FILE_ID_IS_REQUIRED')).min(1, 'AT_LEAST_ONE_FILE_ID_IS_REQUIRED'),
})

export const getWorkspaceFilesSchema = paginationSchema.extend({
    search: z.string().optional(),
    folderId: z.string().nullable().optional(),
})

export const moveFilesSchema = z.object({
    targetFolderId: z.string().nullable(),
    fileIds: z.array(z.string().nonempty('FILE_ID_IS_REQUIRED')).min(1, 'AT_LEAST_ONE_FILE_ID_IS_REQUIRED'),
})

export const restoreFilesSchema = z.object({
    fileIds: z.array(z.string().nonempty('FILE_ID_IS_REQUIRED')).min(1, 'AT_LEAST_ONE_FILE_ID_IS_REQUIRED')
})

export const getFileSchema = z.object({
    fileId: z.string().nonempty('FILE_ID_IS_REQUIRED'),
})

export const getFilePlaylistsSchema = z.object({
    fileId: z.string().nonempty('FILE_ID_IS_REQUIRED'),
})