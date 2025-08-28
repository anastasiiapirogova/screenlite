import { User } from '@/core/entities/user.entity.ts'
import { AuthUser } from '@/core/value-objects/auth-user.vo.ts'

export class AuthUserFactory {
    static fromUser(user: User): AuthUser {
        return new AuthUser({
            id: user.id,
            email: user.email.current,
            name: user.name,
            hasAdminAccess: user.hasAdminAccess,
            isSuperAdmin: user.isSuperAdmin,
            isActive: user.deletionState.isActive,
        })
    }
}
