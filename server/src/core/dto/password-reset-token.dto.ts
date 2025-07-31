export type PasswordResetTokenDTO = {
    id: string
    tokenHash: string
    userId: string
    expiresAt: Date
    createdAt: Date
}