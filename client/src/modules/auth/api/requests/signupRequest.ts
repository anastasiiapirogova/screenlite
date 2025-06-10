import axios from '@config/axios'
import { User } from '@modules/user/types'

export type SignupRequestData = {
	name: string
	email: string
	password: string
}

export type SignupRequestResponse = {
	user: User
	token: string
}

export const signupRequest = async (data: SignupRequestData) => {
    const response = await axios.post<SignupRequestResponse>('auth/signup', data)

    return response.data
}
