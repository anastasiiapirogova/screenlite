import { Request, Response } from 'express'
import mime from 'mime'
import { generateUniqueFileName } from '../utils/generateUniqueFileName.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { createFileUploadSessionSchema } from '../schemas/fileSchemas.js'
import { prisma } from '@config/prisma.js'
import { isValidMimeType } from '../utils/isValidMemeType.js'
import { shortenFileName } from '../utils/shortenFileName.js'
import { FolderRepository } from '../repositories/FolderRepository.js'
import { StorageService } from '@services/StorageService.js'

export const createFileUploadSession = async (req: Request, res: Response) => {
    const user = req.user!
    const workspace = req.workspace!

    const validation = await createFileUploadSessionSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { name, size, folderId, mimeType: providedMime } = validation.data

    const folder = folderId ? await FolderRepository.findFolder(folderId, workspace.id) : null

    const isFolderDeleted = folder && folder.deletedAt

    if (isFolderDeleted) {
        return ResponseHandler.validationError(req, res, {
            folderId: 'CANNOT_UPLOAD_IN_DELETED_FOLDER'
        })
    }

    const isFolderNotFound = folderId && !folder

    if (isFolderNotFound) {
        return ResponseHandler.validationError(req, res, {
            folderId: 'FOLDER_NOT_FOUND',
        })
    }

    const mimeType = providedMime || mime.getType(name)

    const isMimeTypeInvalid = !mimeType || !isValidMimeType(mimeType)

    if (isMimeTypeInvalid) {
        return ResponseHandler.validationError(req, res, {
            mimeType: 'MIME_TYPE_IS_NOT_SUPPORTED',
        })
    }

    const uniqueFilename = generateUniqueFileName(name)
    const key = `workspaces/${workspace.id}/${uniqueFilename}`

    try {
        const uploadId = await StorageService.initializeMultipartUpload(key, mimeType)
        const shortenedName = shortenFileName(name, 100)

        const uploadSession = await prisma.fileUploadSession.create({
            data: {
                name: shortenedName,
                path: key,
                size: size,
                workspaceId: workspace.id,
                userId: user.id,
                mimeType,
                uploadId: uploadId,
                folderId: folder ? folder.id : null,
            }
        })

        return ResponseHandler.created(res, { uploadSession })
    } catch {
        return ResponseHandler.serverError(res, 'Failed to init upload session')
    }
}