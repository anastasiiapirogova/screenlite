import { AuthSessionDTO } from '@/shared/dto/auth-session.dto.ts'

export class AuthSession {
    public readonly id: string
    public readonly isTerminated: boolean
    public readonly pendingTwoFactorAuth: boolean

    constructor(dto: AuthSessionDTO) {
        this.id = dto.id
        this.isTerminated = dto.isTerminated
        this.pendingTwoFactorAuth = dto.pendingTwoFactorAuth
    }
}