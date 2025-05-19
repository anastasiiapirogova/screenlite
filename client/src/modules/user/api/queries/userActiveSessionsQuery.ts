import { userActiveSessionsRequest } from '../requests/userActiveSessionsRequest'

export const userActiveSessionsQuery = (userId: string) => ({
    queryKey: ['userActiveSessions', { userId }],
    queryFn: () => userActiveSessionsRequest(userId),
})