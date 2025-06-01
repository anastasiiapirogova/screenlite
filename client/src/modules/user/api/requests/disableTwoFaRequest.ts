import axios from '@config/axios'
import { User } from '@modules/user/types'

type DisableTwoFaResponse = {
	user: User
}

export const disableTwoFaRequest = async () => {
    const response = await axios.post<DisableTwoFaResponse>(
        '/users/2fa/disable',
    )

    return response.data.user
}