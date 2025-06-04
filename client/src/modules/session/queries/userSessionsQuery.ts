import { userSessionsRequest, UserSessionsRequestFilters } from '../api/requests/userSessionsRequest'

export const userSessionsQuery = ({
    userId,
    filters
}: {
	userId: string
	filters: UserSessionsRequestFilters
}) => ({
    queryKey: ['userSessions', { userId, filters }],
    queryFn: () => userSessionsRequest(userId, filters),
})