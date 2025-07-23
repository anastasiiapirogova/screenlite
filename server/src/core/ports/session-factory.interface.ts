import { Session } from '@/core/entities/session.entity.ts'

export type ISessionFactory = {
    create(params: {
        userId: string
        userAgent: string
        ipAddress: string
        location?: string
    }): Session
}