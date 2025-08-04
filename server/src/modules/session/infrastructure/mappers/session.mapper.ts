import { Session } from '../../../../core/entities/session.entity.ts'
import { SessionDTO } from '../../../../shared/dto/session.dto.ts'
import { ISessionMapper } from '../../domain/ports/session-mapper.interface.ts'
import { PublicSessionDTO } from '../../../../shared/dto/public-session.dto.ts'

export class SessionMapper implements ISessionMapper {
    toDTO(session: Session): SessionDTO {
        return {
            id: session.id,
            userId: session.userId,
            tokenHash: session.tokenHash,
            userAgent: session.userAgent,
            ipAddress: session.ipAddress,
            location: session.location,
            terminatedAt: session.terminatedAt,
            lastActivityAt: session.lastActivityAt,
            twoFaVerifiedAt: session.twoFaVerifiedAt,
            terminationReason: session.terminationReason,
            version: session.version,
        }
    }

    toPublicDTO(session: Session): PublicSessionDTO {
        return {
            id: session.id,
            userId: session.userId,
            userAgent: session.userAgent,
            ipAddress: session.ipAddress,
            location: session.location,
            terminatedAt: session.terminatedAt,
            lastActivityAt: session.lastActivityAt,
            twoFaVerifiedAt: session.twoFaVerifiedAt,
            terminationReason: session.terminationReason,
        }
    }
}