import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'
import { SettingsCard } from '../../../shared/components/SettingsCard'
import { Button } from '@shared/ui/buttons/Button'

export const PasswordSecurityCard = () => {
    const user = useCurrentUser()

    return (
        <SettingsCard
            title='Password'
            description='Your password is used to authenticate your account. Make sure it is strong and unique.'
        >
            <div className='m-5'>
                { user.passwordUpdatedAt && (
                    <div>
                        Password last updated on: { new Date(user.passwordUpdatedAt).toLocaleString() }
                    </div>
                ) }
                <div className='flex justify-end mt-5'>
                    <Button
                        to="/security/password/change"
                        color='secondary'
                        variant="soft"
                    >
                        Change password
                    </Button>
                </div>
            </div>
        </SettingsCard>
    )
}
