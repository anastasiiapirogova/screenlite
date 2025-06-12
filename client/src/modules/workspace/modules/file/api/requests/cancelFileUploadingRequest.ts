import axios from '@config/axios'

export type CancelFileUploadingRequestData = {
	workspaceId: string
	fileUploadSessionId: string
}

export const cancelFileUploadingRequest = async (data: CancelFileUploadingRequestData) => {
    const response = await axios.post(`/workspaces/${data.workspaceId}/files/uploadSessions/${data.fileUploadSessionId}/cancel`, data)

    return response.data
}