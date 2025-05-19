import axios from '../../../../config/axios'
import { Folder, ParentFolderTreeResult } from '../../types'

export type WorkspaceFolderRequestData = {
    folderId: string
}

export type WorkspaceFolderRequestResponse = {
    folder: Folder
    parentFolders: ParentFolderTreeResult[]
}

export const workspaceFolderRequest = async (data: WorkspaceFolderRequestData) => {
    const response = await axios.get<WorkspaceFolderRequestResponse>(`/files/folders/${data.folderId}`)

    return response.data
}