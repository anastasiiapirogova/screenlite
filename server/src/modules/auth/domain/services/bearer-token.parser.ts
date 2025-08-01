import { AuthContextType } from '@/core/enums/auth-context-type.enum.ts'
import { ITokenParser } from '@/core/ports/token-parser.interface.ts'

export interface ParsedToken {
    type: AuthContextType
    token: string
}

export class BearerTokenParser implements ITokenParser<ParsedToken | null> {
    async parse(value: string): Promise<ParsedToken | null> {
        if (!value) {
            return null
        }

        const [prefix, token] = value.split(':', 2)

        if (!token) {
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