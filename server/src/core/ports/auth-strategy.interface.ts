import { AuthContext } from '../context/auth-context.abstract.ts'

export interface IAuthStrategy {
    supports(tokenType: string): boolean
    authenticate(token: string): Promise<AuthContext | null>
}