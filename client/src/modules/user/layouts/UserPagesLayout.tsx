import { Outlet } from 'react-router'
import { Header } from '@shared/components/Header'
import { UserPagesSidebar } from '../components/UserPagesSidebar'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { NavbarUserMenu } from '@shared/components/NavbarUserMenu'

export const UserPagesLayout = () => {
    return (
        <div className="flex flex-col grow w-full bg-slate-100">
            <Header>
                <div className='flex grow justify-end'>
                    <NavbarUserMenu />
                </div>
            </Header>
            <div className="flex grow">
                <div className="w-[275px] p-5 flex flex-col">
                    <UserPagesSidebar />
                </div>
                <LayoutBodyContainer>
                    <ScrollArea verticalMargin={ 24 }>
                        <div className='p-7'>
                            <Outlet />
                        </div>
                    </ScrollArea>
                </LayoutBodyContainer>
            </div>
        </div>
    )
}
