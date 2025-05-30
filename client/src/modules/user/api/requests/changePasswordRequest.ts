import axios from '@config/axios'
import { User } from '@modules/user/types'

export type ChangePasswordData = {
	userId: string
	currentPassword: string
	newPassword: string
}

type ChangePasswordResponse = {
	user: User
}

export const changePasswordRequest = async (data: ChangePasswordData) => {
    const response = await axios.post<ChangePasswordResponse>(
        '/users/changePassword',
        data,
    )

    return response.data.user
}