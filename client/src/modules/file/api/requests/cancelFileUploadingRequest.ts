import axios from '../../../../config/axios'

export type CancelFileUploadingRequestData = {
	fileUploadSessionId: string
}

export const cancelFileUploadingRequest = async (data: CancelFileUploadingRequestData) => {
    const response = await axios.post('/files/cancelFileUploading', data)

    return response.data
}

