import axios from '@config/axios'
import { Folder } from '@modules/file/types'

export type CreateFolderRequestData = {
    name: string
    parentId?: string | null
    workspaceId: string
}

type CreateFolderRequestResponse = {
    folder: Folder
}

export const createFolderRequest = async (data: CreateFolderRequestData) => {
    const response = await axios.post<CreateFolderRequestResponse>('/files/createFolder', data)

    return response.data.folder
}

