import { Request, Response } from 'express'
import { completeFilePartUpload } from '../utils/filePartUploading/completeFilePartUpload.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { UploadFilePartService } from '../services/UploadFilePartService.js'
import { filePartUploadSchema } from '../schemas/fileSchemas.js'

export const uploadFilePart = async (req: Request, res: Response) => {
    const user = req.user!
    const workspace = req.workspace!
    const { fileUploadSessionId } = req.params

    const validation = await filePartUploadSchema.safeParseAsync(req.params)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const fileUploadSession = await UploadFilePartService.validateSession(fileUploadSessionId, workspace.id, user.id)

    if (!fileUploadSession) {
        return ResponseHandler.notFound(res)
    }

    if (fileUploadSession.uploaded === fileUploadSession.size) {
        return ResponseHandler.created(res, {
            fileUploadSession,
        })
    }

    const uploadResult = await UploadFilePartService.handleUpload(req, fileUploadSession)

    if (!uploadResult.success) {
        if (uploadResult.error === 'File too large') {
            return ResponseHandler.tooLarge(res)
        }

        return ResponseHandler.serverError(res, uploadResult.error)
    }

    await completeFilePartUpload(req, res, fileUploadSession, uploadResult.data!)
}