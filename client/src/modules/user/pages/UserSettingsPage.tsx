import { EmailSettingsCard, ProfileSettingsCard, SessionsSettingsCard } from '../components'

export const UserSettingsPage = () => {
    return (
        <div className='max-w-screen-md mx-auto'>
            <div className='text-3xl mb-4'>
                Settings
            </div>
            <div className='flex flex-col gap-2 mb-4'>
                <ProfileSettingsCard />
                <EmailSettingsCard />
                <SessionsSettingsCard />
            </div>
        </div>
    )
}
