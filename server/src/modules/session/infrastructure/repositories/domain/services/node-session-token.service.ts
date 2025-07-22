import crypto from 'crypto'
import { ISessionTokenGenerator } from '@/core/ports/session-token-generator.interface.ts'

export class NodeSessionTokenService implements ISessionTokenGenerator {
    generate(): string {
        return crypto.randomBytes(32).toString('hex')
    }
}