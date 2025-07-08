import axios from '@config/axios'
import { FolderWithChildrenCount } from '@modules/file/types'

export type WorkspaceFoldersRequestData = {
    id: string
    filters: {
        search?: string | null
        deleted: boolean
        parentId?: string | null
    }
}

type WorkspaceFoldersRequestResponse = {
    folders: FolderWithChildrenCount[]
}

export const workspaceFoldersRequest = async (data: WorkspaceFoldersRequestData) => {
    const response = await axios.get<WorkspaceFoldersRequestResponse>(`/workspaces/${data.id}/folders`, {
        params: data.filters
    })

    return response.data.folders
}

export const workspaceFoldersQuery = (
    data: WorkspaceFoldersRequestData
) => ({
    queryKey: ['workspaceFolders', data],
    queryFn: async () => workspaceFoldersRequest(data)
})