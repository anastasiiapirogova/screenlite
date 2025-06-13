import axios from '@config/axios'
import { Folder } from '@workspaceModules/file/types'

export type CreateFolderRequestData = {
    name: string
    parentId?: string | null
    workspaceId: string
}

type CreateFolderRequestResponse = {
    folder: Folder
}

export const createFolderRequest = async (data: CreateFolderRequestData) => {
    const response = await axios.post<CreateFolderRequestResponse>(`/workspaces/${data.workspaceId}/folders`, data)

    return response.data.folder
}

