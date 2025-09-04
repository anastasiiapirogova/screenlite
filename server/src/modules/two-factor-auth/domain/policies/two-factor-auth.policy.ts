import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'

export class TwoFactorAuthPolicy {
    private static isTargetUserSelf(targetUserId: string, authContext: AuthContext): boolean {
        if (!authContext.isUserContext()) {
            return false
        }

        const authenticatedUser = authContext.user

        return authenticatedUser.id === targetUserId
    }

    static canViewTwoFactorMethods(targetUserId: string, authContext: AuthContext): boolean {
        return this.isTargetUserSelf(targetUserId, authContext)
    }

    static enforceViewTwoFactorMethods(targetUserId: string, authContext: AuthContext): void {
        if (!this.canViewTwoFactorMethods(targetUserId, authContext)) {
            throw new ForbiddenError({
                details: {
                    userId: ['YOU_CANNOT_VIEW_TWO_FACTOR_METHODS_FOR_THIS_USER']
                }
            })
        }
    }

    static canViewTotpSetupData(targetUserId: string, authContext: AuthContext): boolean {
        return this.isTargetUserSelf(targetUserId, authContext)
    }

    static canCompleteTotpSetup(targetUserId: string, authContext: AuthContext): boolean {
        return this.canViewTotpSetupData(targetUserId, authContext)
    }

    static canDisableTotpMethod(targetUserId: string, authContext: AuthContext): boolean {
        return this.canViewTotpSetupData(targetUserId, authContext)
    }

    static enforceDisableTotpMethod(targetUserId: string, authContext: AuthContext): void {
        if (!this.canDisableTotpMethod(targetUserId, authContext)) {
            throw new ForbiddenError({
                details: {
                    userId: ['YOU_CANNOT_DISABLE_TOTP_METHOD_FOR_THIS_USER']
                }
            })
        }
    }

    static enforceCompleteTotpSetup(targetUserId: string, authContext: AuthContext): void {
        if (!this.canCompleteTotpSetup(targetUserId, authContext)) {
            throw new ForbiddenError({
                details: {
                    userId: ['YOU_CANNOT_COMPLETE_TOTP_SETUP_FOR_THIS_USER']
                }
            })
        }
    }

    static enforceViewTotpSetupData(targetUserId: string, authContext: AuthContext): void {
        if (!this.canViewTotpSetupData(targetUserId, authContext)) {
            throw new ForbiddenError({
                details: {
                    userId: ['YOU_CANNOT_VIEW_TOTP_SETUP_DATA_FOR_THIS_USER']
                }
            })
        }
    }
} 