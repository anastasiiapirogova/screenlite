/* eslint-disable @typescript-eslint/no-unused-vars */
import { MultipartFileUploader } from '@config/storage.js'
import { FileUploadSession } from '@generated/prisma/client.js'
import { FileRepository } from '../../file/repositories/FileRepository.js'

export const completeMultipartUploadJob = async (fileUploadSession: FileUploadSession, fileId: string) => {
    const session = await MultipartFileUploader.completeUpload(fileUploadSession)

    if (session) {
        await FileRepository.updateFile(fileId, {
            processingStatus: 'pending_metadata_generation'
        })

        // addGenerateFilePreviewAndMetadataJob(fileId)
    }
}