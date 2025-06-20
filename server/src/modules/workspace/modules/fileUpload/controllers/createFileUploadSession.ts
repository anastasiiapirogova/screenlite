import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { MultipartFileUploader } from '@config/storage.js'
import { createFileUploadSessionSchema } from '../schemas/fileUploadSchemas.js'
import { FolderRepository } from '@modules/workspace/modules/file/repositories/FolderRepository.js'
import { FileService } from '@modules/workspace/modules/file/services/FileService.js'
import { FileRepository } from '@modules/workspace/modules/file/repositories/FileRepository.js'
import { prisma } from '@config/prisma.js'

const validateRequest = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const validation = await createFileUploadSessionSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { folderId } = validation.data

    const folder = folderId ? await FolderRepository.findFolder(folderId, workspace.id) : null

    const isFolderDeleted = folder && folder.deletedAt

    const isFolderNotFound = folderId && !folder

    const error = isFolderDeleted ? 'CANNOT_UPLOAD_IN_DELETED_FOLDER' : isFolderNotFound ? 'FOLDER_NOT_FOUND' : null

    if (error) {
        return ResponseHandler.validationError(req, res, {
            folderId: error
        })
    }

    return validation.data
}

export const createFileUploadSession = async (req: Request, res: Response) => {
    const user = req.user!
    const workspace = req.workspace!

    const validation = await validateRequest(req, res)

    if (!validation) return
    
    const { name, mimeType, folderId, size } = validation

    const key = await FileRepository.createFileKey(workspace.id, name)

    const shortenedName = FileService.shortenFileName(name, 100)

    return await prisma.$transaction(async (tx) => {
        const fileUploadSession = await tx.fileUploadSession.create({
            data: {
                name: shortenedName,
                path: key,
                size: BigInt(size),
                workspaceId: workspace.id,
                userId: user.id,
                mimeType: mimeType,
                folderId: folderId || null
            }
        })

        const { uploadId } = await MultipartFileUploader.initializeUpload(fileUploadSession)

        await tx.fileUploadSession.update({
            where: { id: fileUploadSession.id },
            data: { uploadId }
        })

        return ResponseHandler.created(res, { fileUploadSession })
    }).catch(() => {
        return ResponseHandler.serverError(req, res, 'FAILED_TO_INIT_FILE_UPLOAD_SESSION')
    })
}