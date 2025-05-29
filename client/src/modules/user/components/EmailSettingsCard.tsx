import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'
import { SettingsCard } from './SettingsCard'
import { Button } from '@shared/ui/buttons/Button'

export const EmailSettingsCard = () => {
    const user = useCurrentUser()

    return (
        <SettingsCard
            title='Email'
            description='Email is used for authentication, invitations to workspaces and for password recovery.'
        >
            <div className='m-5'>
                <div>
                    { user.email }
                </div>
                <div className='flex justify-end'>
                    <Button
                        to="/settings/email"
                        color='secondary'
                        variant="soft"
                        onClick={ () => alert('Change profile picture functionality not implemented yet.') }
                    >
                        Change email
                    </Button>
                </div>
            </div>
        </SettingsCard>
    )
}
