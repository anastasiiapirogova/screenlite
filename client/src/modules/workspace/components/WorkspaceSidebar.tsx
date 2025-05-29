import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { cloneElement, createElement, useMemo } from 'react'
import { Link } from 'react-router'
import { WorkspacePicture } from '@shared/components/WorkspacePicture'
import { TbApps, TbChevronDown, TbFolder, TbLayoutDashboard, TbListDetails, TbSettings, TbSmartHome, TbUsers, TbUserScreen } from 'react-icons/tb'
import { IconType } from 'react-icons/lib'
import { Accordion } from 'radix-ui'
import { twMerge } from 'tailwind-merge'

type BaseItem = {
    title: string
    icon?: IconType
}

type LinkItem = BaseItem & {
    to: string
}

type SidebarItem = BaseItem & {
    children?: LinkItem[]
    to?: string
}

const SidebarGroupItem = ({ title, icon, children }: SidebarItem) => {
    return (
        <Accordion.Root
            className='flex flex-col w-full gap-2'
            type="single"
            collapsible
        >
            <Accordion.Item value={ title }>
                <Accordion.Header>
                    <Accordion.Trigger className={ twMerge(
                        'p-2 h-12 flex items-center hover:bg-gray-100 rounded-lg cursor-default w-full justify-between transition-colors',
                    ) }
                    >
                        <div className='flex items-center'>
                            {
                                icon && cloneElement(createElement(icon), {
                                    className: 'w-7 h-7 mr-2 text-black'
                                })
                            }
                            { title }
                        </div>
                        <TbChevronDown className='w-5 h-5 transform group-data-[state=open]:rotate-180 transition-transform text-gray-400' />
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className={ twMerge(
                    'overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown',
                ) }
                >
                    <div className='border-l-2 ml-5 pl-3 my-1 border-gray-300'>
                        {
                            children?.map((item => {
                                const { title, to } = item

                                return (
                                    <SidebarLinkItem 
                                        key={ title }
                                        title={ title }
                                        to={ to! }
                                    />
                                )
                            }
                            ))
                        }
                    </div>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
    )
}

const SidebarLinkItem = ({ to, icon, title }: LinkItem) => {
    return (
        <Link
            to={ to }
            className="p-2 h-12 flex items-center hover:bg-gray-100 rounded-lg cursor-default transition-colors"
            draggable={ false }
        >
            {
                icon && cloneElement(createElement(icon), {
                    className: 'w-7 h-7 mr-2 text-black'
                })
            }
            { title }
        </Link>
    )
}

const SidebarItems = ({ items }: { items: SidebarItem[] }) => {
    return (
        <div className="flex flex-col gap-1">
            {
                items.map((item) => {
                    const { title, to, icon, children } = item

                    return (
                        <div key={ title }>
                            { to && (
                                <SidebarLinkItem
                                    title={ title }
                                    to={ to }
                                    icon={ icon }
                                />
                            ) }
                            { children && (
                                <SidebarGroupItem
                                    title={ title }
                                    children={ children }
                                    icon={ icon }
                                />
                            ) }
                        </div>
                    )
                })
            }
        </div>
    )
}

export const WorkspaceSidebar = () => {
    const workspace = useWorkspace()
    const routes = useWorkspaceRoutes()
        
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
        <div>
            <div>
                <div className="flex items-center h-14 bg-white">
                    <div className='flex gap-4 items-center p-3 cursor-default'>
                        <WorkspacePicture
                            name={ workspace.name }
                            picture={ workspace.picture }
                            size={ 40 }
                        />
                        <div className=''>
                            { workspace.name }
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 p-3">
                    <SidebarItems items={ mainMenuItems }/>
                    <hr className='my-2'/>
                    <SidebarItems items={ settingsMenuItems }/>
                </div>
            </div>
            <div className='p-2'>
                asd
            </div>
        </div>
    )
}
