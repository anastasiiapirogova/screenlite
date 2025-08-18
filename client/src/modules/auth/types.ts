import { User } from '@modules/user/types'

export type CurrentUserData = {
    user: User
    sessionId: string
    hasCompletedTwoFactorAuth: boolean
    twoFactorAuthEnabled: boolean
}