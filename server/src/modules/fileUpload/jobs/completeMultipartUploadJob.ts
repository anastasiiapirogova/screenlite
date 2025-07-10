 
import { MultipartFileUploader } from '@/config/storage.ts'
import { FileUploadSession } from '@/generated/prisma/client.ts'
import { FileRepository } from '../../file/repositories/FileRepository.ts'
import { FileJobProducer } from '@/bullmq/producers/FileJobProducer.ts'

export const completeMultipartUploadJob = async (fileUploadSession: FileUploadSession, fileId: string) => {
    const session = await MultipartFileUploader.completeUpload(fileUploadSession)

    if (session) {
        await FileRepository.updateFile(fileId, {
            processingStatus: 'pending_metadata_generation'
        })

        await FileJobProducer.queueGenerateFilePreviewAndMetadataJob(fileId)
    }
}