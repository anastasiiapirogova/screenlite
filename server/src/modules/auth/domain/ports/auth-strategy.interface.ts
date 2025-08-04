import { AuthContext } from '../../../../core/types/auth-context.type.ts'

export interface IAuthStrategy {
    supports(tokenType: string): boolean
    authenticate(token: string): Promise<AuthContext | null>
}