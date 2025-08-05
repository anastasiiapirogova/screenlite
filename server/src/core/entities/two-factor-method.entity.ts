import { TwoFactorMethodDto } from '@/shared/dto/two-factor-method.dto.ts'
import { TwoFactorMethodType } from '../enums/two-factor-method-type.enum.ts'
import { TwoFactorConfig } from '../types/two-factor-config.type.ts'

export class TwoFactorMethod {
    public readonly id: string
    public readonly userId: string
    public readonly type: TwoFactorMethodType
    private _enabled: boolean
    public readonly config: TwoFactorConfig
    public lastUsedAt: Date | null
    public readonly createdAt: Date

    constructor(
        data: TwoFactorMethodDto
    ) {
        this.id = data.id
        this.userId = data.userId
        this.type = data.type
        this._enabled = data.enabled
        this.config = data.config
        this.lastUsedAt = data.lastUsedAt
        this.createdAt = data.createdAt
    }

    enable(): void {
        this._enabled = true
    }

    disable(): void {
        this._enabled = false
    }

    get enabled(): boolean {
        return this._enabled
    }
}