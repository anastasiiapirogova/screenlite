import { User } from '@/core/entities/user.entity.ts'

export const enforcePermission = (
    actor: User,
    condition: boolean,
    error?: Error
): void => {
    if (actor.isSuperAdmin) {
        return
    }

    if (!condition) {
        throw error ?? new Error('Permission denied')
    }
}