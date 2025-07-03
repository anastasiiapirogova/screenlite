import axios from '@config/axios'

export type DeleteFilesRequestData = {
    fileIds: string[]
    workspaceId: string
}

export const deleteFilesRequest = async (data: DeleteFilesRequestData) => {
    const response = await axios.post(`/workspaces/${data.workspaceId}/files/delete`, data)

    return response.data
}