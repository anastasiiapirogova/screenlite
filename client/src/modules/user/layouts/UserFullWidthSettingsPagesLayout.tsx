import { Outlet } from 'react-router'
import { useAuth } from '@modules/auth/hooks/useAuth'
import { Button } from '@shared/ui/buttons/Button'
import { Header } from '@shared/components/Header'

export const UserFullWidthSettingsPagesLayout = () => {
    const { onLogout } = useAuth()
	
    return (
        <div className="flex flex-col grow w-full bg-slate-100">
            <Header>
                <div className='flex grow justify-end'>
                    <Button
                        onClick={ onLogout }
                        color='secondary'
                        variant="soft"
                    >
                        Logout
                    </Button>
                </div>
            </Header>
            <div className="flex grow px-3">
                <div className='bg-white rounded-3xl grow'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
