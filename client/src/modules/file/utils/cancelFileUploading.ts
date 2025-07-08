import { isAxiosError } from 'axios'
import { cancelFileUploadingRequest } from '../api/cancelFileUploading'

export const cancelFileUploading = async (fileUploadSessionId: string, workspaceId: string) => {
    const successCodes = [403, 404]

    try {
        await cancelFileUploadingRequest({ fileUploadSessionId, workspaceId })

        return true
    } catch (error) {
        if (isAxiosError(error)) {
            return successCodes.includes(error.status ?? 0)
        }

        return false
    }
}
