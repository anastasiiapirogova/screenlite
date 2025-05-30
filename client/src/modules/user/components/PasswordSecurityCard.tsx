import { SettingsCard } from './SettingsCard'
import { Button } from '@shared/ui/buttons/Button'

export const PasswordSecurityCard = () => {
    return (
        <SettingsCard
            title='Password'
            description='Your password is used to authenticate your account. Make sure it is strong and unique.'
        >
            <div className='m-5'>
                <div className='flex justify-end'>
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
