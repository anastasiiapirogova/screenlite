import axios from '@config/axios'

export type MoveFilesRequestData = {
    fileIds: string[]
    targetFolderId: string | null
    workspaceId: string
}

export const moveFilesRequest = async (data: MoveFilesRequestData) => {
    const response = await axios.post(`/workspaces/${data.workspaceId}/files/move`, data)

    return response.data
}