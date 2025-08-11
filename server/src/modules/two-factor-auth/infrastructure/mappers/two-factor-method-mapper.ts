import { TwoFactorMethod } from '@/core/entities/two-factor-method.entity.ts'

export class TwoFactorMethodMapper {
    toPublicDTO(twoFactorMethod: TwoFactorMethod) {
        return {
            id: twoFactorMethod.id,
            type: twoFactorMethod.type,
            enabled: twoFactorMethod.enabled,
            createdAt: twoFactorMethod.createdAt,
        }
    }
}