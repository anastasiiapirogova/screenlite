import { paginationSchema } from '@/schemas/paginationSchema.ts'
import { z } from 'zod'

const folderNameSchema = z.string().nonempty('FOLDER_NAME_IS_REQUIRED').max(100, 'FOLDER_NAME_TOO_LONG')

export const getFolderSchema = z.object({
    folderId: z.string().nonempty('FOLDER_ID_IS_REQUIRED'),
})

export const getWorkspaceSoftDeletedFoldersSchema = paginationSchema

export const createFolderSchema = z.object({
    name: folderNameSchema,
    parentId: z.string().nullable().optional(),
})

export const updateFolderSchema = z.object({
    name: folderNameSchema,
    folderId: z.string().nonempty('FOLDER_ID_IS_REQUIRED'),
})

export const moveFolderSchema = z.object({
    targetFolderId: z.string().nullable(),
    folderIds: z.array(z.string().nonempty('FOLDER_ID_IS_REQUIRED')).min(1, 'AT_LEAST_ONE_FOLDER_ID_IS_REQUIRED'),
})

export const deleteFoldersSchema = z.object({
    folderIds: z.array(z.string().nonempty('FOLDER_ID_IS_REQUIRED')).min(1, 'AT_LEAST_ONE_FOLDER_ID_IS_REQUIRED'),
})

export const getWorkspaceFoldersSchema = z.object({
    search: z.string().optional(),
    parentId: z.string().nullable().optional(),
})

export const restoreFoldersSchema = z.object({
    folderIds: z.array(z.string().nonempty('FOLDER_ID_IS_REQUIRED')).min(1, 'AT_LEAST_ONE_FOLDER_ID_IS_REQUIRED')
})