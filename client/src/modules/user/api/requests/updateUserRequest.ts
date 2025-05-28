import axios from '@config/axios'
import { User } from '@modules/user/types'

export type UpdateUserData = {
	userId: string
	name?: string
	profilePhoto?: string
}

type UpdateUserResponse = {
	user: User
}

export const updateUserRequest = async (data: UpdateUserData) => {
    const response = await axios.post<UpdateUserResponse>('/users/update', data)

    return response.data.user
}