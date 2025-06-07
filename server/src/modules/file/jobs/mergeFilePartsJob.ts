import { createFileFromFileUploadSession } from '../utils/createFileFromFileUploadSession.js'
import { mergeFileParts } from '../utils/mergeFileParts.js'

export const mergeFilePartsJob = async (fileUploadSessionId: string) => {
    const fileUploadSession = await mergeFileParts(fileUploadSessionId)

    if (fileUploadSession) {
        await createFileFromFileUploadSession(fileUploadSession)
    }
}