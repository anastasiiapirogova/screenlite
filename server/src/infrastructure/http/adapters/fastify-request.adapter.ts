import { FastifyRequest } from 'fastify'
import { IRequest } from '@/core/ports/request.interface.ts'

export class FastifyRequestAdapter implements IRequest {
    constructor(private readonly request: FastifyRequest) {}

    getIP(): string {
        const ip = this.request.headers['x-real-ip'] || this.request.headers['x-forwarded-for'] || this.request.ip

        console.log('ip', ip)

        return Array.isArray(ip) ? ip[0] : ip
    }

    getUserAgent(): string {
        return this.request.headers['user-agent'] || ''
    }
}