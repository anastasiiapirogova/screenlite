import { SessionTokenParser } from '@/core/ports/session-token-parser.interface.ts'

export class BearerSessionTokenParser implements SessionTokenParser {
    async parse(token: string): Promise<string> {
        if (!token) {
            throw new Error('Invalid token')
        }

        return token
    }
}
