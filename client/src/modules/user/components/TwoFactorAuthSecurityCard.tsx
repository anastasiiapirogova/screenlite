import { SettingsCard } from './SettingsCard'
import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'
import { Button } from '@shared/ui/buttons/Button'

export const TwoFactorAuthSecurityCard = () => {
    const user = useCurrentUser()

    return (
        <SettingsCard
            title='Two-factor authentication'
            description='Secure your account by enabling 2FA with any TOTP app, such as Google Authenticator, Microsoft Authenticator, or any other compatible app.'
        >
            <div className='m-5'>
                {
                    user.twoFactorEnabled ? (
                        <div>
                            Two-factor authentication is enabled.
                        </div>
                    ) : (
                        <div className='text-orange-500'>
                            Two-factor authentication is not enabled.
                        </div>
                    )
                }
                <div className='flex justify-end mt-5'>
                    <Button
                        to="/security/2fa"
                        color='secondary'
                        variant="soft"
                    >
                        Settings
                    </Button>
                </div>
            </div>
        </SettingsCard>
    )
}
