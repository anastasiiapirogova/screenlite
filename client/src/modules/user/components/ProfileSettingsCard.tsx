import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'
import { SettingsCard } from '@shared/components/SettingsCard'
import { UserAvatar } from '@shared/components/UserAvatar'
import { Button } from '@shared/ui/buttons/Button'

export const ProfileSettingsCard = () => {
    const user = useCurrentUser()
	
    return (
        <SettingsCard
            title="Profile information"
            description='Your profile information is visible to other users.'
        >
            <div className='m-5'>
                <div className='flex items-center gap-3 mb-4'>
                    <UserAvatar
                        name={ user.name }
                        profilePhoto={ user.profilePhotoPath }
                        size="large"
                    />
                    <div>
                        { user.name }
                    </div>
                </div>
                <div className='flex justify-end'>
                    <Button
                        to="/settings/profile"
                        color='secondary'
                        variant="soft"
                    >
                        Edit profile
                    </Button>
                </div>
            </div>
        </SettingsCard>
    )
}
