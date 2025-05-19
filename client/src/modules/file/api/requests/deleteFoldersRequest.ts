import axios from '@config/axios'

export type DeleteFoldersRequestData = {
    folderIds: string[]
}

export const deleteFoldersRequest = async (data: DeleteFoldersRequestData) => {
    const response = await axios.post('/files/deleteFolders', data)

    return response.data
}