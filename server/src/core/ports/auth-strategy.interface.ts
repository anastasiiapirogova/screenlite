import { AuthContext } from '../types/auth-context.type.ts'

export interface IAuthStrategy {
    supports(tokenType: string): boolean
    authenticate(token: string): Promise<AuthContext | null>
}