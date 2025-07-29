import { AuthContextAbstract } from '@/core/context/auth-context.abstract.ts'
import { AdminApiKeyAuthContext } from '@/core/context/admin-api-key-auth.context.ts'
import { SystemAuthContext } from '@/core/context/system-auth.context.ts'
import { WorkspaceApiKeyAuthContext } from '@/core/context/workspace-api-key-auth.context.ts'
import { UserSessionAuthContext } from '@/core/context/user-session-auth.context.ts'
import { GuestAuthContext } from '@/core/context/guest-auth.context.ts'

export type AuthContext = AuthContextAbstract | AdminApiKeyAuthContext | SystemAuthContext | WorkspaceApiKeyAuthContext | UserSessionAuthContext | GuestAuthContext