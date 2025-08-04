import { Session as PrismaSession } from '@/generated/prisma/client.ts'
import { SessionTerminationReason } from '../../../../core/enums/session-termination-reason.enum.ts'
import { Session } from '../../../../core/entities/session.entity.ts'

export class PrismaRepositorySessionMapper {
    static toDomain(prismaSession: PrismaSession): Session {
        return new Session({
            id: prismaSession.id,
            userId: prismaSession.userId,
            tokenHash: prismaSession.tokenHash,
            userAgent: prismaSession.userAgent,
            ipAddress: prismaSession.ipAddress,
            location: prismaSession.location,
            terminatedAt: prismaSession.terminatedAt,
            lastActivityAt: prismaSession.lastActivityAt,
            twoFaVerifiedAt: prismaSession.twoFaVerifiedAt,
            terminationReason: prismaSession.terminationReason as SessionTerminationReason | null,
            version: prismaSession.version,
        })
    }

    static toPersistence(session: Session): Omit<PrismaSession, 'createdAt'> {
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
}