import { SessionDTO } from '@/core/dto/session.dto.ts'

export class Session {
    public readonly id: string
    public readonly userId: string
    public readonly token: string
    public readonly userAgent: string
    public readonly ipAddress: string
    public readonly location: string | null
    private _terminatedAt: Date | null = null
    private _lastActivityAt: Date
    private _twoFaVerifiedAt: Date | null = null
    private _terminationReason: string | null = null
    
    constructor(dto: SessionDTO) {
        this.id = dto.id
        this.userId = dto.userId
        this.token = dto.token
        this.userAgent = dto.userAgent
        this.ipAddress = dto.ipAddress
        this.location = dto.location
        this._terminatedAt = dto.terminatedAt
        this._lastActivityAt = dto.lastActivityAt
        this._twoFaVerifiedAt = dto.twoFaVerifiedAt
        this._terminationReason = dto.terminationReason
    }

    terminate(reason: string): void {
        this._terminatedAt = new Date()
        this._terminationReason = reason
    }

    updateActivity(): void {
        this._lastActivityAt = new Date()
    }

    verifyTwoFactor(): void {
        this._twoFaVerifiedAt = new Date()
    }

    get terminatedAt(): Date | null {
        return this._terminatedAt
    }

    get lastActivityAt(): Date {
        return this._lastActivityAt
    }

    get twoFaVerifiedAt(): Date | null {
        return this._twoFaVerifiedAt
    }

    get terminationReason(): string | null {
        return this._terminationReason
    }

    isActive(): boolean {
        return this._terminatedAt === null
    }

    toDTO(): SessionDTO {
        return {
            id: this.id,
            userId: this.userId,
            token: this.token,
            userAgent: this.userAgent,
            ipAddress: this.ipAddress,
            location: this.location,
            terminatedAt: this._terminatedAt,
            lastActivityAt: this._lastActivityAt,
            twoFaVerifiedAt: this._twoFaVerifiedAt,
            terminationReason: this.terminationReason,
        }
    }
}