import { fileUploadQueue } from '@/bullmq/queues/fileUploadQueue.js'
import { FileUploadSession } from '@/generated/prisma/client.js'
import { FileRepository } from '@workspaceModules/modules/file/repositories/FileRepository.js'

export const addCompleteMultipartUploadJob = async (fileUploadSession: FileUploadSession) => {
    const file = await FileRepository.createFileFromFileUploadSession(fileUploadSession)

    const { id: fileId } = file

    await fileUploadQueue.add(
        'completeMultipartUpload',
        {
            fileUploadSession,
            fileId
        },
        {
            jobId: `completeMultipartUpload:${fileUploadSession.id}`,
            removeOnComplete: true,
            removeOnFail: false,
        }
    )
}