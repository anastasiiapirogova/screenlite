import { userInvitationsRequest } from '../requests/userInvitationsRequest'

export const userInvitationsQuery = (userId: string) => ({
    queryKey: ['userInvitations', { userId }],
    queryFn: async () => {
        return await userInvitationsRequest(userId)
    },
})