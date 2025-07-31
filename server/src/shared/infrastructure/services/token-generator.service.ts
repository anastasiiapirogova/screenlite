import crypto from 'crypto'
import { ITokenGenerator } from '@/core/ports/token-generator.interface.ts'

export class TokenGenerator implements ITokenGenerator {
    generate(length = 32, prefix = ''): string {
        const token = crypto.randomBytes(length).toString('base64url')

        return `${prefix}${token}`
    }
}
