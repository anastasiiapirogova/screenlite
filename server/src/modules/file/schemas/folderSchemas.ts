import { z } from 'zod'

const folderNameSchema = z.string().nonempty('FOLDER_NAME_IS_REQUIRED').max(100, 'FOLDER_NAME_TOO_LONG')

export const createFolderSchema = z.object({
    name: folderNameSchema,
    parentId: z.string().nullable().optional(),
    workspaceId: z.string().nonempty('WORKSPACE_ID_IS_REQUIRED'),
})

export const updateFolderSchema = z.object({
    name: folderNameSchema,
    folderId: z.string().nonempty('FOLDER_ID_IS_REQUIRED'),
})

export const moveToFolderSchema = z.object({
    folderId: z.string().nullable(),
    fileIds: z.array(z.string()).optional(),
    folderIds: z.array(z.string()).optional(),
    workspaceId: z.string().nonempty('WORKSPACE_ID_IS_REQUIRED'),
})

export const deleteFoldersSchema = z.object({
    folderIds: z.array(z.string().nonempty('FOLDER_ID_IS_REQUIRED')),
})