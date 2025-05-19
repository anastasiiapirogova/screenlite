import { workspaceFoldersRequest, WorkspaceFoldersRequestData } from '../requests/workspaceFoldersRequest'

export const workspaceFoldersQuery = (
    data: WorkspaceFoldersRequestData
) => ({
    queryKey: ['workspaceFoldersQuery', data],
    queryFn: async () => workspaceFoldersRequest(data)
})