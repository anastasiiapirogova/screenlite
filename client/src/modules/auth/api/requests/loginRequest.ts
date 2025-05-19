import axios from '../../../../config/axios'
import { User } from '../../../user/types'

export type LoginRequestData = {
	email: string
	password: string
}

export type LoginRequestResponse = {
	user: User
	token: string
}

export const loginRequest = async (data: LoginRequestData) => {
    const response = await axios.post<LoginRequestResponse>('auth/login', data)

    return response.data
}
