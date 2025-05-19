import { workspaceFolderRequest, WorkspaceFolderRequestData } from '../requests/workspaceFolderRequest'

export const workspaceFolderQuery = (
    data: WorkspaceFolderRequestData
) => ({
    queryKey: ['workspaceFolderQuery', data],
    queryFn: async () => workspaceFolderRequest(data)
})