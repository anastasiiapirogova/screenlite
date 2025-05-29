import { Outlet } from 'react-router'
import { useAuth } from '@modules/auth/hooks/useAuth'
import { Button } from '@shared/ui/buttons/Button'
import { Header } from '@shared/components/Header'
import { UserPagesSidebar } from '../components/UserPagesSidebar'

export const UserPagesLayout = () => {
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
            <div className="flex grow">
                <div className="w-[275px] p-5 flex flex-col">
                    <UserPagesSidebar />
                </div>
                <div className='bg-white rounded-3xl grow p-7'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
