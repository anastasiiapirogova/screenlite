import axios from '@config/axios'

export type DeleteFoldersRequestData = {
    folderIds: string[]
    workspaceId: string
}

export const deleteFoldersRequest = async (data: DeleteFoldersRequestData) => {
    const response = await axios.post(`/workspaces/${data.workspaceId}/folders/delete`, data)

    return response.data
}