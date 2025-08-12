import { SessionDTO } from '@/shared/dto/session.dto.ts'
import { SessionTerminationReason } from '../enums/session-termination-reason.enum.ts'

export class Session {
    public readonly id: string
    public readonly userId: string
    private _tokenHash: string
    public readonly userAgent: string
    public readonly ipAddress: string
    public readonly location: string | null
    private _terminatedAt: Date | null = null
    private _lastActivityAt: Date
    private _completedTwoFactorAuthAt: Date | null = null
    private _terminationReason: SessionTerminationReason | null = null
    public readonly version: number

    constructor(dto: SessionDTO) {
        this.id = dto.id
        this.userId = dto.userId
        this._tokenHash = dto.tokenHash
        this.userAgent = dto.userAgent
        this.ipAddress = dto.ipAddress
        this.location = dto.location
        this._terminatedAt = dto.terminatedAt
        this._lastActivityAt = dto.lastActivityAt
        this._completedTwoFactorAuthAt = dto.completedTwoFactorAuthAt
        this._terminationReason = dto.terminationReason
        this.version = dto.version
    }

    terminate(reason: SessionTerminationReason): void {
        this._terminatedAt = new Date()
        this._terminationReason = reason
    }

    updateActivity(): void {
        this._lastActivityAt = new Date()
    }

    authenticateTwoFactor(): void {
        this._completedTwoFactorAuthAt = new Date()
    }

    updateTokenHash(tokenHash: string): void {
        this._tokenHash = tokenHash
    }

    get terminatedAt(): Date | null {
        return this._terminatedAt
    }

    get lastActivityAt(): Date {
        return this._lastActivityAt
    }

    get completedTwoFactorAuthAt(): Date | null {
        return this._completedTwoFactorAuthAt
    }

    get terminationReason(): SessionTerminationReason | null {
        return this._terminationReason
    }

    get isActive(): boolean {
        return this._terminatedAt === null
    }

    get tokenHash(): string {
        return this._tokenHash
    }
}