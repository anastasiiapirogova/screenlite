import { useAuth } from './useAuth'

export const useAuthData = () => {
    const { user, sessionId, hasCompletedTwoFactorAuth, twoFactorAuthEnabled } = useAuth()

    return { user: user!, sessionId: sessionId!, hasCompletedTwoFactorAuth: hasCompletedTwoFactorAuth!, twoFactorAuthEnabled: twoFactorAuthEnabled! }
}