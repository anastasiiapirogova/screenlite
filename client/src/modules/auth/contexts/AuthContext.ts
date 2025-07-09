import { createContext } from 'react'
import { User } from '../../user/types'
import { LoginRequestResponse } from '../api/login'

export type AuthContext = {
	user: User | null | undefined
	onLogin: (data: LoginRequestResponse) => void
	onLogout: () => void
}

export const AuthContext = createContext<AuthContext>(null!)