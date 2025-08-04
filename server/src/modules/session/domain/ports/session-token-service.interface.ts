import { Session } from '@/core/entities/session.entity.ts'

export type ISessionTokenService = {
    generateToken(): string
    hashToken(token: string): Promise<string>
    formatToken(token: string): string
    rotateToken(session: Session): Promise<{ session: Session, token: string }>
}