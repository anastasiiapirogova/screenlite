import { PrismaClient, Prisma } from '@/generated/prisma/client.ts'
import { TwoFactorMethodType } from '@/core/enums/two-factor-method-type.enum.ts'
import { TwoFactorConfigPersistenceHandler } from './two-factor-config-persistence-handler.interface.ts'
import { TotpConfigHandler } from './totp-config.handler.ts'
import { ITwoFactorConfigHandlerFactory } from '../../domain/ports/two-factor-config-handler-factory.interface.ts'

export class TwoFactorConfigHandlerFactory implements ITwoFactorConfigHandlerFactory {
    constructor(
        private readonly prisma: PrismaClient | Prisma.TransactionClient
    ) {}

    getHandler(method: TwoFactorMethodType): TwoFactorConfigPersistenceHandler {
        switch (method) {
            case TwoFactorMethodType.TOTP:
                return new TotpConfigHandler(this.prisma)
            default:
                throw new Error(`Unsupported two-factor method: ${method}`)
        }
    }

    getAllIncludes(): Prisma.TwoFactorMethodInclude {
        return {
            totpConfig: true,
        }
    }
}