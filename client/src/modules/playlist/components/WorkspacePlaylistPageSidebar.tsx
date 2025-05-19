import { dayjs } from '@config/dayjs'
import { HoverPopover } from '@shared/ui/HoverPopover'
import { usePlaylist } from '../hooks/usePlaylist'
import { useRelativeTime } from '@shared/hooks/useRelativeTime'
import { BackToPlaylistsButton } from './buttons/BackToPlaylistsButton'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { NavLink } from 'react-router'
import { twMerge } from 'tailwind-merge'

const UpdatedAtPopover = () => {
    const playlist = usePlaylist()
    const formattedDate = dayjs(playlist.updatedAt).format('MMMM D, YYYY [at] h:mm A')

    return (
        <div className='bg-neutral-950 text-white text-sm px-2 py-1 rounded-sm opacity-85'>
            Last modified on { formattedDate }
        </div>
    )
}

export const WorkspacePlaylistPageSidebar = () => {
    const playlist = usePlaylist()
    const updatedAtFromNow = useRelativeTime(playlist.updatedAt)
    const routes = useWorkspaceRoutes()

    const links = [
        {
            title: 'Details',
            to: routes.playlist(playlist.id),
        },
        {
            title: 'Screens',
            to: routes.playlistScreens(playlist.id),
            count: playlist._count.screens,
        },
        {
            title: 'Schedules',
            to: routes.playlistSchedules(playlist.id),
            count: playlist.schedules.length,
        }
    ]

    return (
        <div className='flex flex-col gap-5'>
            <div>
                <BackToPlaylistsButton />
            </div>
            <div className='text-xl font-semibold'>
                Playlist
            </div>
            <div className='bg-neutral-50 px-5 py-3 rounded-md flex flex-col gap-2'>
                <div>
                    <div className='text-neutral-500'>
                        Name
                    </div>
                    <div className='text-lg'>
                        {
                            playlist.name
                        }
                    </div>
                </div>
                <div>
                    <div className='text-neutral-500'>
                        Description
                    </div>
                    <div className='text-lg'>
                        {
                            playlist.description
                        }
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                {
                    links.map((link, index) => (
                        <NavLink
                            key={ index }
                            className={
                                ({ isActive }) => (
                                    twMerge([
                                        'bg-transparent px-5 py-2 rounded-md transition-colors font-medium flex justify-between',
                                        isActive && 'bg-blue-50 text-blue-600',
                                        !isActive && 'text-neutral-500 hover:hover:bg-neutral-100',
                                    ])
                                )
                            }
                            to={ link.to }
                            end
                        >
                            <div>
                                { link.title }
                            </div>
                            <div>
                                { link.count }
                            </div>
                        </NavLink>
                    ))
                }
            </div>
            <div className='flex justify-between items-center mb-10'>
                <div className='flex items-center gap-3 text-neutral-400'>
                    <HoverPopover popoverBody={ <UpdatedAtPopover /> }>
                        <div className='flex items-center gap-1.5'>
                            <div className='cursor-default'>
                                <span className='select-none'>
                                    Updated { updatedAtFromNow }
                                </span>
                            </div>
                        </div>
                    </HoverPopover>
                </div>
            </div>
        </div>
    )
}
