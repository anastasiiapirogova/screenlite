import { isAxiosError } from 'axios'
import { cancelFileUploadingRequest } from '../api/requests/cancelFileUploadingRequest'

export const cancelFileUploading = async (fileUploadSessionId: string) => {
    const successCodes = [403, 404]

    try {
        await cancelFileUploadingRequest({ fileUploadSessionId })

        return true
    } catch (error) {
        if (isAxiosError(error)) {
            return successCodes.includes(error.status ?? 0)
        }

        return false
    }
}
