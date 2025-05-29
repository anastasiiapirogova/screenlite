import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'

export const EmailSettingsCard = () => {
    const user = useCurrentUser()
	
    return (
        <div>
            <div className='text-sm text-gray-500 mb-1'>
                Email
            </div>
            Email: { user.email }
        </div>
    )
}
