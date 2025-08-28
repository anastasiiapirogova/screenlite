import { TotpConfig } from '@/core/value-objects/totp-config.vo.ts'
import { SetupTotpConfigDTO } from '../../application/dto/public-totp-config.dto.ts'

export class TotpConfigMapper {
    toSetupTotpConfigDTO(entity: TotpConfig, secret: string, url: string): SetupTotpConfigDTO {
        return {
            algorithm: entity.algorithm,
            digits: entity.digits,
            period: entity.period,
            secret,
            url,
        }
    }
}