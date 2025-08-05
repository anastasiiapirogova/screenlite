import { TwoFactorMethodType } from '@/core/enums/two-factor-method-type.enum.ts'
import { TwoFactorConfigPersistenceHandler } from '../../infrastructure/handlers/two-factor-config-persistence-handler.interface.ts'
import { Prisma } from '@/generated/prisma/client.ts'

export interface ITwoFactorConfigHandlerFactory {
    getHandler(method: TwoFactorMethodType): TwoFactorConfigPersistenceHandler
    getAllIncludes(): Prisma.TwoFactorMethodInclude
}