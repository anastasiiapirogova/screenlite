import { useAuth } from '@modules/auth/hooks/useAuth'
import { useCurrentUser } from '@modules/auth/hooks/useCurrentUser'
import { UserWorkspaces } from '@modules/workspace/components/UserWorkspaces'
import { UserAvatar } from '@shared/components/UserAvatar'
import { Button } from '@shared/ui/buttons/Button'

export const HomePage = () => {
    const user = useCurrentUser()
    const { onLogout } = useAuth()
	
    return (
        <div className="flex flex-col grow w-full bg-gray-100">
            <div className="bg-white p-4 border-b border-neutral-200 flex justify-between items-center">
                <div>
                    Screenlite
                </div>
                <div>
                    <Button
                        onClick={ onLogout }
                        color='secondary'
                        variant="soft"
                    >
                        Logout
                    </Button>
                </div>
            </div>
            <div className="flex grow">
                <div className="w-[400px] bg-white border-r border-neutral-200 p-10 flex flex-col justify-between">
                    <div>
                        <UserAvatar
                            name={ user.name }
                            profilePhoto={ null }
                            size="large"
                        />
                        <div className='text-xl font-semibold mt-2'>
                            { user.name }
                        </div>
                        <div className='text-sm text-gray-500 mt-1'>
                            { user.email }
                        </div>
                    </div>
                    <div>
                        <Button
                            to="/settings"
                            color='secondary'
                            variant="soft"
                            className="mt-4 w-full"
                            pill={ false }
                        >
                            Settings
                        </Button>
                    </div>
                </div>
                <div>
                    <UserWorkspaces />
                </div>
            </div>
        </div>
    )
}
