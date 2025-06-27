import { fileUploadQueue } from '@/bullmq/queues/fileUploadQueue.ts'
import { FileUploadSession } from '@/generated/prisma/client.ts'
import { FileRepository } from '@workspaceModules/modules/file/repositories/FileRepository.ts'

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