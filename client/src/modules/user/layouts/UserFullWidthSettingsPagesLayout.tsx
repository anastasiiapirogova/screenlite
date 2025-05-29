import { Outlet } from 'react-router'
import { useAuth } from '@modules/auth/hooks/useAuth'
import { Button } from '@shared/ui/buttons/Button'

export const UserFullWidthSettingsPagesLayout = () => {
    const { onLogout } = useAuth()
	
    return (
        <div className="flex flex-col grow w-full bg-slate-100">
            <div className="p-4 border-neutral-200 flex justify-between items-center">
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
            <div className="flex grow px-3">
                <div className='bg-white rounded-3xl grow'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
