import axios from '@config/axios'
import { FileUploadSession } from '@modules/file/types'

export type CreateFileUploadSessionRequestData = {
	workspaceId: string
	name: string
	size: number
	mimeType: string
	folderId: string | undefined
}

type CreateFileUploadSessionRequestResponse = {
	fileUploadSession: FileUploadSession
}

export const createFileUploadSessionRequest = async (data: CreateFileUploadSessionRequestData) => {
    const response = await axios.post<CreateFileUploadSessionRequestResponse>(`/workspaces/${data.workspaceId}/files/uploadSessions`, data)

    return response.data.fileUploadSession
}