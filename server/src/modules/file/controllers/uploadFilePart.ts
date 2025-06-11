import { Request, Response } from 'express'
import { z } from 'zod'
import { FileUploadSession } from 'generated/prisma/client.js'
import { completeFilePartUpload } from '../utils/filePartUploading/completeFilePartUpload.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { FileUploadingRepository } from '../repositories/FileUploadingRepository.js'
import { WORKSPACE_PERMISSIONS } from '@modules/workspace/constants/permissions.js'
import { WorkspacePermissionService } from '@modules/workspace/services/WorkspacePermissionService.js'

const filePartUploadSchema = z.object({
    'x-file-upload-session-id': z.string().nonempty('FILE_UPLOAD_SESSION_ID_IS_REQUIRED'),
})

const validateRequest = async (req: Request, res: Response) => {
    const validation = await filePartUploadSchema.safeParseAsync(req.headers)

    if (!validation.success) {
        ResponseHandler.zodError(req, res, validation.error.errors)
        return null
    }

    return validation.data['x-file-upload-session-id']
}

const handleUpload = (req: Request, res: Response, fileUploadSession: FileUploadSession) => {
    const uploadData: Buffer[] = []
    let totalSize = 0
    const MAX_SIZE = 100 * 1024 * 1024

    const handleDataChunk = (chunk: Buffer) => {
        totalSize += chunk.length

        if (totalSize > MAX_SIZE || BigInt(totalSize) + fileUploadSession.uploaded > BigInt(fileUploadSession.size)) {
            res.status(413).send('File too large')
            req.destroy()
            return
        }

        uploadData.push(chunk)
    }

    const handleError = () => {
        res.status(500).send('Error during file upload')
    }

    const handleUploadCompletion = async () => {
        if (totalSize > MAX_SIZE) {
            return
        }

        const data = Buffer.concat(uploadData)

        await completeFilePartUpload(req, res, fileUploadSession, data)
    }

    req.on('data', handleDataChunk)
    req.on('error', handleError)
    req.on('end', handleUploadCompletion)
}

export const uploadFilePart = async (req: Request, res: Response) => {
    const user = req.user!
    const workspace = req.workspace!

    const allowed = WorkspacePermissionService.can(workspace.permissions, WORKSPACE_PERMISSIONS.CREATE_FILES)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const sessionId = await validateRequest(req, res)

    if (!sessionId) return

    const fileUploadSession = await FileUploadingRepository.getFileUploadSession(sessionId, workspace.id)

    if (!fileUploadSession) {
        return ResponseHandler.notFound(res)
    }

    if (user.id !== fileUploadSession.userId) {
        return ResponseHandler.forbidden(res)
    }

    if (fileUploadSession.uploaded === fileUploadSession.size) {
        return ResponseHandler.created(res, {
            fileUploadSession,
        })
    }

    handleUpload(req, res, fileUploadSession)
}