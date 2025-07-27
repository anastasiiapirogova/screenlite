import { IAuthContext } from './auth-context.interface.ts'

export interface IAuthStrategy {
    supports(tokenType: string): boolean
    authenticate(token: string): Promise<IAuthContext | null>
}