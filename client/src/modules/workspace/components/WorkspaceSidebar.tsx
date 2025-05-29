import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { SidebarItems } from '@shared/components/SidebarItems'
import { useMemo } from 'react'
import { TbApps, TbFolder, TbLayoutDashboard, TbListDetails, TbSettings, TbSmartHome, TbUsers, TbUserScreen } from 'react-icons/tb'
import { useParams } from 'react-router'

export const WorkspaceSidebar = () => {
    const params = useParams<{ workspaceSlug: string }>()
    const routes = useWorkspaceRoutes(params.workspaceSlug)
        
    const mainMenuItems = useMemo(() => [
        {
            title: 'Dashboard',
            to: routes.home,
            icon: TbSmartHome
        },
        {
            title: 'Screens',
            to: routes.screens,
            icon: TbUserScreen
        },
        { 
            title: 'Playlists', 
            to: routes.playlists, 
            icon: TbListDetails 
        },
        { 
            title: 'Content', 
            icon: TbFolder, 
            children: [
                { title: 'Uploadings', to: routes.filesUpload },
                { title: 'Files', to: routes.files },
                { title: 'Links', to: routes.files },
            ]
        },
        { 
            title: 'Apps', 
            to: routes.files,
            icon: TbApps 
        },
        { 
            title: 'Layouts', 
            to: routes.playlistLayouts, 
            icon: TbLayoutDashboard 
        },
    ], [routes])
    
    const settingsMenuItems = useMemo(() => [
        { 
            title: 'Members', 
            to: routes.members, 
            icon: TbUsers 
        },
        { 
            title: 'Settings', 
            to: routes.settings, 
            icon: TbSettings 
        },
    ], [routes])
        
    return (
        <div className="flex flex-col gap-5">
            <SidebarItems items={ mainMenuItems }/>
            <SidebarItems items={ settingsMenuItems }/>
        </div>
    )
}
