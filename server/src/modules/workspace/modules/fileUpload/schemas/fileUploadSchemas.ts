import { fileNameSchema } from '@/modules/workspace/modules/file/schemas/fileSchemas.js'
import { z } from 'zod'
import { FileService } from '@/modules/workspace/modules/file/services/FileService.js'
import mime from 'mime'
import { MAX_UPLOAD_FILE_SIZE } from '@/config/files.js'

const validateMimeType = (name: string, providedMime?: string) => {
    const mimeType = providedMime || mime.getType(name)

    return mimeType && FileService.isValidMimeType(mimeType) ? mimeType : null
}

export const createFileUploadSessionSchema = z.object({
    name: fileNameSchema,
    size: z.preprocess(
        (val) => Number(val),
        z.number({
            invalid_type_error: 'FILE_SIZE_IS_INVALID',
        })
            .int('FILE_SIZE_IS_INVALID')
            .positive('FILE_SIZE_IS_INVALID')
            .max(MAX_UPLOAD_FILE_SIZE, 'FILE_SIZE_TOO_LARGE')
    ),
    mimeType: z.string({ invalid_type_error: 'MIME_TYPE_IS_INVALID' }).optional(),
    folderId: z.string().optional(),
}).refine(
    (data) => {
        const mimeType = validateMimeType(data.name, data.mimeType)

        return mimeType !== null
    },
    {
        message: 'MIME_TYPE_IS_NOT_SUPPORTED',
        path: ['mimeType']
    }
).transform((data) => ({
    ...data,
    mimeType: validateMimeType(data.name, data.mimeType)!
}))

export const filePartUploadSchema = z.object({
    'fileUploadSessionId': z.string().nonempty('FILE_UPLOAD_SESSION_ID_IS_REQUIRED'),
})