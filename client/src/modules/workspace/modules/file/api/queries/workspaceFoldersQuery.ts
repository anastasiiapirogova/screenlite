import { workspaceFoldersRequest, WorkspaceFoldersRequestData } from '../requests/workspaceFoldersRequest'

export const workspaceFoldersQuery = (
    data: WorkspaceFoldersRequestData
) => ({
    queryKey: ['workspaceFolders', data],
    queryFn: async () => workspaceFoldersRequest(data)
})