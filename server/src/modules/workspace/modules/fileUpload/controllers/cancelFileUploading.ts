import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { MultipartFileUploader } from '@config/storage.js'
import { prisma } from '@config/prisma.js'
import { FileUploadRepository } from '../repositories/FileUploadRepository.js'

export const cancelFileUploading = async (req: Request, res: Response) => {
    const user = req.user!
    const workspace = req.workspace!

    const { fileUploadSessionId } = req.params

    const fileUploadSession = await FileUploadRepository.getFileUploadSession(fileUploadSessionId, workspace.id)

    if (!fileUploadSession || fileUploadSession.cancelledAt || fileUploadSession.completedAt) {
        return ResponseHandler.notFound(res)
    }

    if (user.id !== fileUploadSession.userId) {
        return ResponseHandler.forbidden(res)
    }

    return await prisma.$transaction(async (tx) => {
        const cancelledFileUploadSession = await tx.fileUploadSession.update({
            where: { id: fileUploadSessionId },
            data: {
                cancelledAt: new Date(),
            }
        })

        await MultipartFileUploader.abortUpload(cancelledFileUploadSession)

        return ResponseHandler.json(res, {
            fileUploadSession: cancelledFileUploadSession
        })
    }).catch(() => {
        return ResponseHandler.serverError(res, 'Failed to cancel file upload')
    })
}