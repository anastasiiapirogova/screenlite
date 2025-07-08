import axios from '@config/axios'

export type MoveFoldersRequestData = {
    folderIds: string[]
    targetFolderId: string | null
    workspaceId: string
}

export const moveFoldersRequest = async (data: MoveFoldersRequestData) => {
    const response = await axios.post(`/workspaces/${data.workspaceId}/folders/move`, data)

    return response.data
}