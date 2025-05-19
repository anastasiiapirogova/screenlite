import { AxiosProgressEvent } from 'axios'
import axios from '../../../../config/axios'
import { FileUploadSession } from '../../types'

export type UploadFilePartRequestData = {
	filePart: Blob
	sessionId: string
	onProgress?: (progressEvent: AxiosProgressEvent) => void
	abortController?: AbortController
}

type UploadFilePartRequestResponse = {
	fileUploadSession: FileUploadSession
}

export const uploadFilePartRequest = async (data: UploadFilePartRequestData) => {
    const response = await axios.put<UploadFilePartRequestResponse>('/files/upload', data.filePart, {
        headers: {
            'X-File-Upload-Session-Id': data.sessionId,
            'Content-Type': 'application/octet-stream'
        },
        onUploadProgress: data.onProgress,
        signal: data.abortController?.signal
    })

    return response.data.fileUploadSession
}
