import { TwoFactorMethod } from '@/core/entities/two-factor-method.entity.ts'
import { TwoFactorMethodType } from '@/core/enums/two-factor-method-type.enum.ts'

export interface ITwoFactorMethodRepository {
    save(twoFactorMethod: TwoFactorMethod): Promise<void>
    findByUserId(userId: string): Promise<TwoFactorMethod[]>
    findByUserIdAndType(userId: string, type: TwoFactorMethodType): Promise<TwoFactorMethod | null>
    delete(twoFactorMethodId: string): Promise<void>
}