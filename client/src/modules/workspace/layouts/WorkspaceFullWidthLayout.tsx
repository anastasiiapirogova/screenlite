import { Outlet } from 'react-router'
import { Header } from '@shared/components/Header'
import { WorkspaceHeaderButton } from '../components/WorkspaceHeaderButton'
import { NavbarUserMenu } from '@shared/components/NavbarUserMenu'

export const WorkspaceFullWidthLayout = () => {
    return (
        <div className="flex flex-col grow w-full bg-slate-100">
            <Header>
                <div className='flex grow justify-between items-center gap-2'>
                    <WorkspaceHeaderButton />
                    <NavbarUserMenu />
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
