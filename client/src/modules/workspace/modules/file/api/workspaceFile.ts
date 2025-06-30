import axios from '@config/axios'
import { WorkspaceFile } from '@workspaceModules/file/types'

export type WorkspaceFileRequestData = {
    fileId: string
	workspaceId: string
}

export type WorkspaceFileRequestResponse = {
    file: WorkspaceFile
}

export const workspaceFileRequest = async (data: WorkspaceFileRequestData) => {
    const response = await axios.get<WorkspaceFileRequestResponse>(`/workspaces/${data.workspaceId}/files/${data.fileId}`)

    return response.data.file
}

export const workspaceFileQuery = (
    data: WorkspaceFileRequestData
) => ({
    queryKey: ['workspaceFile', data],
    queryFn: async () => workspaceFileRequest(data)
})