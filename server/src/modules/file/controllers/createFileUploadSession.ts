import { Request, Response } from 'express'
import { CreateMultipartUploadCommand } from '@aws-sdk/client-s3'
import mime from 'mime'
import { generateUniqueFileName } from '../utils/generateUniqueFileName.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { filePolicy } from '../policies/filePolicy.js'
import { WorkspaceRepository } from '@modules/workspace/repositories/WorkspaceRepository.js'
import { createFileUploadSessionSchema } from '../schemas/fileSchemas.js'
import { prisma } from '@config/prisma.js'
import { Buckets, s3Client } from '@config/s3Client.js'
import { isValidMimeType } from '../utils/isValidMemeType.js'
import { shortenFileName } from '../utils/shortenFileName.js'

export const createFileUploadSession = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = await createFileUploadSessionSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { workspaceId, name, size, folderId, mimeType: providedMime } = validation.data

    const mimeType = providedMime || mime.getType(name)

    if (!mimeType || !isValidMimeType(mimeType)) {
        return ResponseHandler.validationError(req, res, { mimeType: 'MIME_TYPE_IS_NOT_SUPPORTED' })
    }

    const workspace = await WorkspaceRepository.getWithFolder(workspaceId, folderId)

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await filePolicy.canUploadFiles(user, workspace.id)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const uniqueFilename = generateUniqueFileName(name)

    const params = {
        Bucket: Buckets.uploads,
        Key: `workspaces/${workspaceId}/${uniqueFilename}`,
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
            workspaceId,
            userId: user.id,
            mimeType,
            uploadId: multipartUpload.UploadId,
            folderId: workspace.folders?.length ? workspace.folders[0].id : null
        }
    })

    return ResponseHandler.created(res, { uploadSession })
}