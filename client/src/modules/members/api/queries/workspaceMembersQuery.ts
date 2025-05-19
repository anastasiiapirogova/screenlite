import { workspaceMembersRequest, WorkspaceMembersRequestData } from '../requests/workspaceMembersRequest'

export const workspaceMembersQuery = (
    data: WorkspaceMembersRequestData
) => ({
    queryKey: ['workspaceMembersQuery', data],
    queryFn: async () => workspaceMembersRequest(data)
})