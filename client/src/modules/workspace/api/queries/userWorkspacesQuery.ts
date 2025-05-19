import { userWorkspacesRequest } from '../requests/userWorkspacesRequest'

export const userWorkspacesQuery = (userId: string, page: number = 1, limit: number = 10) => ({
    queryKey: ['userWorkspaces', { userId, page, limit }],
    queryFn: async () => {
        return await userWorkspacesRequest(userId, page, limit)
    },
})