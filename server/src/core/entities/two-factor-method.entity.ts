import { TwoFactorMethodType } from '../enums/two-factor-method-type.enum.ts'
import { TwoFactorConfig } from '../types/two-factor-config.type.ts'

export class TwoFactorMethod {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly type: TwoFactorMethodType,
        private _enabled: boolean,
        public readonly config: TwoFactorConfig,
        public lastUsedAt: Date | null,
        public readonly createdAt: Date,
    ) {}

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