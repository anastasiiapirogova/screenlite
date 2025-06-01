import axios from '@config/axios'
import { User } from '@modules/user/types'

export type EnableTwoFaData = {
	token: string
}

type EnableTwoFaResponse = {
	user: User
}

export const enableTwoFaRequest = async (data: EnableTwoFaData) => {
    const response = await axios.post<EnableTwoFaResponse>(
        '/users/2fa/enable',
        data,
    )

    return response.data.user
}