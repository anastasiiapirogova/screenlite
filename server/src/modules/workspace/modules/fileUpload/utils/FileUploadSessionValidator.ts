import { FileUploadSession } from '@/generated/prisma/client.js'
import { Request, Response } from 'express'
import { filePartUploadSchema } from '../schemas/fileUploadSchemas.js'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { FileUploadRepository } from '../repositories/FileUploadRepository.js'

export class FileUploadSessionValidator {
    static async validate(req: Request, res: Response): Promise<FileUploadSession | undefined> {
        const user = req.user!
        const workspace = req.workspace!
        const { fileUploadSessionId } = req.params

        const validation = await filePartUploadSchema.safeParseAsync({ fileUploadSessionId })

        if (!validation.success) {
            ResponseHandler.zodError(req, res, validation.error.errors)
            return undefined
        }

        const session = await FileUploadRepository.getFileUploadSession(fileUploadSessionId, workspace.id)

        if (!session) {
            ResponseHandler.notFound(req, res, 'FILE_UPLOAD_SESSION_NOT_FOUND')
            return undefined
        }

        if (session.userId !== user.id) {
            ResponseHandler.forbidden(req, res)
            return undefined
        }

        if (session.completedAt || session.cancelledAt) {
            ResponseHandler.notFound(req, res, 'UPLOAD_COMPLETED')
            return undefined
        }

        return session
    }
}
