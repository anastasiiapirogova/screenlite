import { z } from 'zod'

const folderNameSchema = z.string().nonempty('FOLDER_NAME_IS_REQUIRED').max(100, 'FOLDER_NAME_TOO_LONG')

export const getFolderSchema = z.object({
    folderId: z.string().nonempty('FOLDER_ID_IS_REQUIRED'),
})

export const createFolderSchema = z.object({
    name: folderNameSchema,
    parentId: z.string().nullable().optional(),
    workspaceId: z.string().nonempty('WORKSPACE_ID_IS_REQUIRED'),
})

export const updateFolderSchema = z.object({
    name: folderNameSchema,
    folderId: z.string().nonempty('FOLDER_ID_IS_REQUIRED'),
})

export const moveFolderSchema = z.object({
    targetFolderId: z.string().nullable(),
    folderIds: z.array(z.string()),
})

export const moveFilesSchema = z.object({
    targetFolderId: z.string().nullable(),
    fileIds: z.array(z.string()),
})

export const deleteFoldersSchema = z.object({
    folderIds: z.array(z.string().nonempty('FOLDER_ID_IS_REQUIRED')),
})

export const getWorkspaceFoldersSchema = z.object({
    search: z.string().optional(),
    deleted: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
    parentId: z.string().nullable().optional(),
})