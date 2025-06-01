import axios from '@config/axios'
import { User } from '@modules/user/types'

export type VerifyTwoFaData = {
	token: string
}

type VerifyTwoFaResponse = {
	user: User
}

export const verifyTwoFaRequest = async (data: VerifyTwoFaData) => {
    const response = await axios.post<VerifyTwoFaResponse>(
        '/users/2fa/verify',
        data,
    )

    return response.data.user
}