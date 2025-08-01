import { SidebarItems } from '@shared/components/SidebarItems'
import { useMemo } from 'react'
import { TbMailForward, TbSettings, TbShieldCheck, TbSmartHome, TbWorld } from 'react-icons/tb'

export const UserPagesSidebar = () => {
    const menuItems = useMemo(() => [
        {
            title: 'Home',
            to: '/',
            icon: TbSmartHome
        },
        {
            title: 'Workspaces',
            to: '/workspaces',
            icon: TbWorld
        },
        {
            title: 'Invitations',
            to:'/invitations',
            icon: TbMailForward
        },
        { 
            title: 'Settings', 
            to: '/settings', 
            icon: TbSettings 
        },
        { 
            title: 'Security', 
            to: '/security',
            icon: TbShieldCheck 
        }
    ], [])
        
    return (
        <div className="flex flex-col gap-5">
            <SidebarItems items={ menuItems }/>
        </div>
    )
}
