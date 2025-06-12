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
    const response = await axios.put<ChangePasswordResponse>(
        `/users/${data.userId}/password`,
        data,
    )

    return response.data.user
}