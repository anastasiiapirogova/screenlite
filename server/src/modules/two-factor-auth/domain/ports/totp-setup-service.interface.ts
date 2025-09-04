import { TwoFactorMethod } from '@/core/entities/two-factor-method.entity.ts'
import { ITwoFactorMethodRepository } from './two-factor-method-repository.interface.ts'

export interface ITotpSetupService {
    createTotpMethod(userId: string, repository: ITwoFactorMethodRepository): Promise<{ method: TwoFactorMethod, secret: string }>
}