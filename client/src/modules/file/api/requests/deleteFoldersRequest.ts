import axios from '@config/axios'

export type DeleteFoldersRequestData = {
    folderIds: string[]
    workspaceId: string
}

export const deleteFoldersRequest = async (data: DeleteFoldersRequestData) => {
    const response = await axios.delete(`/workspaces/${data.workspaceId}/folders`, { data })

    return response.data
}