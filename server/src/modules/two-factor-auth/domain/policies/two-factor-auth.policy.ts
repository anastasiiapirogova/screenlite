import { User } from '@/core/entities/user.entity.ts'
import { ForbiddenError } from '@/shared/errors/forbidden.error.ts'
import { AuthContext } from '@/core/types/auth-context.type.ts'

export class TwoFactorAuthPolicy {
    constructor(
        private readonly user: User,
        private readonly authContext: AuthContext
    ) {}

    private isSelf(): boolean {
        if(this.authContext.isUserContext()) {
            const authUser = this.authContext.user

            return authUser.id === this.user.id
        }

        return false
    }

    canViewTwoFactorMethods(): boolean {
        if(this.isSelf()) {
            return true
        }
        
        return false
    }

    enforceViewTwoFactorMethods(): void {
        if(!this.canViewTwoFactorMethods()) {
            throw new ForbiddenError({
                details: {
                    userId: ['YOU_CANNOT_VIEW_TWO_FACTOR_METHODS_FOR_THIS_USER']
                }
            })
        }
    }

    canViewTotpSetupData(): boolean {
        if(this.isSelf()) {
            return true
        }

        return false
    }

    canCompleteTotpSetup(): boolean {
        return this.canViewTotpSetupData()
    }

    canDisableTotpMethod(): boolean {
        return this.canViewTotpSetupData()
    }

    enforceDisableTotpMethod(): void {
        if(!this.canDisableTotpMethod()) {
            throw new ForbiddenError({
                details: {
                    userId: ['YOU_CANNOT_DISABLE_TOTP_METHOD_FOR_THIS_USER']
                }
            })
        }
    }

    enforceCompleteTotpSetup(): void {
        if(!this.canCompleteTotpSetup()) {
            throw new ForbiddenError({
                details: {
                    userId: ['YOU_CANNOT_COMPLETE_TOTP_SETUP_FOR_THIS_USER']
                }
            })
        }
    }

    enforceViewTotpSetupData(): void {
        if(!this.canViewTotpSetupData()) {
            throw new ForbiddenError({
                details: {
                    userId: ['YOU_CANNOT_VIEW_TOTP_SETUP_DATA_FOR_THIS_USER']
                }
            })
        }
    }
} 