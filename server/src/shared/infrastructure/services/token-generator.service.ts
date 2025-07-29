import crypto from 'crypto'
import { ITokenGenerator } from '@/core/ports/token-generator.interface.ts'

export class TokenGenerator implements ITokenGenerator {
    generate(length = 32): string {
        return crypto.randomBytes(length).toString('base64url')
    }
}
