import { Link, Outlet } from 'react-router'
import { ReactNode } from 'react'
import { NavLink } from 'react-router'
import { twMerge } from 'tailwind-merge'
import { useAuth } from '@modules/auth/hooks/useAuth'
import { Button } from '@shared/ui/buttons/Button'

const MenuItem = ({ to, children }: { to: string, children: ReactNode }) => {
    return (
        <NavLink
            to={ to }
            className={
                ({ isActive }) => (
                    twMerge(
                        [
                            'flex items-center gap-2 px-5 py-2 text-gray-600 rounded-full transition-colors',
                            isActive ? 'bg-slate-200 text-gray-700' : 'hover:bg-slate-200'
                        ]
                    )
                )
            }
            end
        >
            { children }
        </NavLink>
    )
}

const Menu = () => {
    return (
        <div className="flex flex-col gap-1">
            <MenuItem to="/">Workspaces</MenuItem>
            <MenuItem to="/invitations">Invitations</MenuItem>
            <MenuItem to="/settings">Settings</MenuItem>
        </div>
    )
}

export const UserPagesLayout = () => {
    const { onLogout } = useAuth()
	
    return (
        <div className="flex flex-col grow w-full bg-slate-100">
            <div className="p-4 border-neutral-200 flex justify-between items-center">
                <Link to="/">
                    Screenlite
                </Link>
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
                <div className="w-[275px] p-5 flex flex-col">
                   
                    <div className=''>
                        <Menu />
                    </div>
                </div>
                <div className='bg-white rounded-3xl grow p-7'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
