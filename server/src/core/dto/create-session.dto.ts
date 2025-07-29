export type CreateSessionDTO = {
    id: string
    userId: string
    token: string
    userAgent: string
    ipAddress: string
    location?: string | null
}