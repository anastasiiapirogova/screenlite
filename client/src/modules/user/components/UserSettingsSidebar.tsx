import { Sidebar, SidebarItem, SidebarItemsGroup } from '@/shared/ui/Sidebar'
import { TbSettings, TbShieldCheck } from 'react-icons/tb'

export const UserSettingsSidebar = () => {
    return (
        <Sidebar>
            <SidebarItemsGroup>
                <SidebarItem
                    icon={ TbSettings }
                    text="Settings"
                    to='/settings'
                />
                <SidebarItem
                    icon={ TbShieldCheck }
                    text="Sessions"
                    to='/settings/sessions'
                />
            </SidebarItemsGroup>
        </Sidebar>			
    )
}
