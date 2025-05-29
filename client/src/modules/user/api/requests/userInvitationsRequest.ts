import axios from '@/config/axios'
import { UserInvitation } from '@modules/user/types'

type UserInvitaionsRequestResponse = {
	invitations: UserInvitation[]
}

export const userInvitationsRequest = async (userId: string) => {
    const response = await axios.get<UserInvitaionsRequestResponse>(`/users/${userId}/invitations`)

    return response.data.invitations
}