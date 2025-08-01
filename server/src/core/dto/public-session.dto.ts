import { SessionTerminationReason } from '../enums/session-termination-reason.enum.ts'

export type PublicSessionDTO = {
    id: string
    userId: string
    userAgent: string
    ipAddress: string
    location: string | null
    terminatedAt: Date | null
    lastActivityAt: Date
    twoFaVerifiedAt: Date | null
    terminationReason: SessionTerminationReason | null
}