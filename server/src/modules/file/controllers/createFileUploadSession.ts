import { Request, Response } from 'express'
import { CreateMultipartUploadCommand } from '@aws-sdk/client-s3'
import mime from 'mime'
import { generateUniqueFileName } from '../utils/generateUniqueFileName.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { createFileUploadSessionSchema } from '../schemas/fileSchemas.js'
import { prisma } from '@config/prisma.js'
import { Buckets, s3Client } from '@config/s3Client.js'
import { isValidMimeType } from '../utils/isValidMemeType.js'
import { shortenFileName } from '../utils/shortenFileName.js'
import { WorkspacePermissionService } from '@modules/workspace/services/WorkspacePermissionService.js'
import { WORKSPACE_PERMISSIONS } from '@modules/workspace/constants/permissions.js'
import { FolderRepository } from '../repositories/FolderRepository.js'

export const createFileUploadSession = async (req: Request, res: Response) => {
    const user = req.user!
    const workspace = req.workspace!

    const allowed = WorkspacePermissionService.can(workspace.permissions, WORKSPACE_PERMISSIONS.CREATE_FILES)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const validation = await createFileUploadSessionSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { name, size, folderId, mimeType: providedMime } = validation.data

    const folder = folderId ? await FolderRepository.findFolderInWorkspace(workspace.id, folderId) : null

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

    const params = {
        Bucket: Buckets.uploads,
        Key: `workspaces/${workspace.id}/${uniqueFilename}`,
        ContentType: mimeType,
    }

    const multipartUpload = await s3Client.send(new CreateMultipartUploadCommand(params))

    if (!multipartUpload.UploadId) {
        return ResponseHandler.serverError(res, 'Failed to init upload session')
    }

    const shortenedName = shortenFileName(name, 100)

    const uploadSession = await prisma.fileUploadSession.create({
        data: {
            name: shortenedName,
            path: params.Key,
            size: size,
            workspaceId: workspace.id,
            userId: user.id,
            mimeType,
            uploadId: multipartUpload.UploadId,
            folderId: folder ? folder.id : null,
        }
    })

    return ResponseHandler.created(res, { uploadSession })
}