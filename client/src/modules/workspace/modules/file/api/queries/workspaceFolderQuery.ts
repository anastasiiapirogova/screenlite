import { workspaceFolderRequest, WorkspaceFolderRequestData } from '../requests/workspaceFolderRequest'

export const workspaceFolderQuery = (
    data: WorkspaceFolderRequestData
) => ({
    queryKey: ['workspaceFolder', data],
    queryFn: async () => workspaceFolderRequest(data)
})