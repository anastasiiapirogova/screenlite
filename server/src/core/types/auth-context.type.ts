import { AbstractAuthContext } from '@/core/auth/abstract-auth.context.ts'
import { AdminApiKeyAuthContext } from '@/core/auth/admin-api-key-auth.context.ts'
import { SystemAuthContext } from '@/core/auth/system-auth.context.ts'
import { WorkspaceApiKeyAuthContext } from '@/core/auth/workspace-api-key-auth.context.ts'
import { UserSessionAuthContext } from '@/core/auth/user-session-auth.context.ts'
import { GuestAuthContext } from '@/core/auth/guest-auth.context.ts'

export type AuthContext = AbstractAuthContext | AdminApiKeyAuthContext | SystemAuthContext | WorkspaceApiKeyAuthContext | UserSessionAuthContext | GuestAuthContext