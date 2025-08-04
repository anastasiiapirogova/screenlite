export type EmailVerificationTokenDTO = {
    id: string
    userId: string
    tokenHash: string
    type: string
    expiresAt: Date
    newEmail: string | null
    createdAt: Date
}