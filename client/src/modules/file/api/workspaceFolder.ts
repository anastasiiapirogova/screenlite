import axios from '@config/axios'
import { Folder, ParentFolderTreeResult } from '@modules/file/types'

export type WorkspaceFolderRequestData = {
    folderId: string
	workspaceId: string
}

export type WorkspaceFolderRequestResponse = {
    folder: Folder
    parentFolders: ParentFolderTreeResult[]
}

export const workspaceFolderRequest = async (data: WorkspaceFolderRequestData) => {
    const response = await axios.get<WorkspaceFolderRequestResponse>(`/workspaces/${data.workspaceId}/folders/${data.folderId}`)

    return response.data
}

export const workspaceFolderQuery = (
    data: WorkspaceFolderRequestData
) => ({
    queryKey: ['workspaceFolder', data],
    queryFn: async () => workspaceFolderRequest(data)
})