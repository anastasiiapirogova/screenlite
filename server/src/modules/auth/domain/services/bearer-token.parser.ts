import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { ITokenParser } from '@/core/ports/token-parser.interface.ts'

export interface ParsedToken {
    type: AuthContextType
    token: string
}

// SHA-256 hex string (64 chars)
const MAX_TOKEN_LENGTH = 64

export class BearerTokenParser implements ITokenParser<ParsedToken | null> {
    async parse(value: string): Promise<ParsedToken | null> {
        if (!value) {
            return null
        }

        const [prefix, token] = value.split(':', 2)

        if (!token || token.length > MAX_TOKEN_LENGTH) {
            return null
        }

        switch (prefix) {
            case AuthContextType.UserSession:
            case AuthContextType.WorkspaceApiKey:
            case AuthContextType.AdminApiKey:
                return { type: prefix, token }
            default:
                return null
        }
    }
}