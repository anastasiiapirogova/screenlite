export type SessionDTO = {
    id: string
    userId: string
    tokenHash: string
    userAgent: string
    ipAddress: string
    location: string | null
    terminatedAt: Date | null
    lastActivityAt: Date
    twoFaVerifiedAt: Date | null
    terminationReason: string | null
}