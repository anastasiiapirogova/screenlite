import { addGenerateFilePreviewAndMetadataJob } from '../utils/addGenerateFilePreviewAndMetadataJob.js'
import { createFileFromFileUploadSession } from '../utils/createFileFromFileUploadSession.js'
import { mergeFileParts } from '../utils/mergeFileParts.js'

export const mergeFilePartsJob = async (fileUploadSessionId: string) => {
    const fileUploadSession = await mergeFileParts(fileUploadSessionId)

    if (fileUploadSession) {
        const file = await createFileFromFileUploadSession(fileUploadSession)

        addGenerateFilePreviewAndMetadataJob(file.id)
    }
}