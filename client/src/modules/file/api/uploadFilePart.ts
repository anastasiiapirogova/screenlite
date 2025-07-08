import axios from '@config/axios'
import { FileUploadSession } from '@modules/file/types'
import { AxiosProgressEvent } from 'axios'

export type UploadFilePartRequestData = {
	filePart: Blob
	workspaceId: string
	sessionId: string
	onProgress?: (progressEvent: AxiosProgressEvent) => void
	abortController?: AbortController
}

type UploadFilePartRequestResponse = {
	fileUploadSession: FileUploadSession
}

export const uploadFilePartRequest = async (data: UploadFilePartRequestData) => {
    const response = await axios.put<UploadFilePartRequestResponse>(`/workspaces/${data.workspaceId}/files/uploadSessions/${data.sessionId}/uploadPart`, data.filePart, {
        headers: {
            'Content-Type': 'application/octet-stream'
        },
        onUploadProgress: data.onProgress,
        signal: data.abortController?.signal
    })

    return response.data.fileUploadSession
}
