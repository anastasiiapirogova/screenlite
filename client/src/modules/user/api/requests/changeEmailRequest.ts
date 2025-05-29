import axios from '@config/axios'
import { User } from '@modules/user/types'

export type ChangeEmailData = {
	userId: string
	email: string
}

type ChangeEmailResponse = {
	user: User
}

export const changeEmailRequest = async (data: ChangeEmailData) => {
    const response = await axios.post<ChangeEmailResponse>(
        '/users/changeEmail',
        data,
    )

    return response.data.user
}