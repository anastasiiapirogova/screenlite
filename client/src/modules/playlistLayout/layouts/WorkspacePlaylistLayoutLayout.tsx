import { Outlet } from 'react-router'
import { dayjs } from '@config/dayjs'
import { HoverPopover } from '@shared/ui/HoverPopover'
import { useRelativeTime } from '@shared/hooks/useRelativeTime'
import { TbClockEdit } from 'react-icons/tb'
import { usePlaylistLayout } from '../hooks/usePlaylistLayout'

const UpdatedAtPopover = () => {
    const playlistLayout = usePlaylistLayout()
    const formattedDate = dayjs(playlistLayout.updatedAt).format('MMMM D, YYYY [at] h:mm A')

    return (
        <div className='bg-neutral-950 text-white text-sm px-2 py-1 rounded-sm opacity-85'>
            Last modified on { formattedDate }
        </div>
    )
}

export const WorkspacePlaylistLayoutLayout = () => {
    const playlistLayout = usePlaylistLayout()
    const updatedAtFromNow = useRelativeTime(playlistLayout.updatedAt)

    return (
        <div className='max-w-(--breakpoint-xl) mx-auto w-full pb-20'>
            <div className='flex justify-between items-center mb-10'>
                <div className='flex items-center gap-3 text-neutral-400'>
                    <HoverPopover popoverBody={ <UpdatedAtPopover /> }>
                        <div className='flex items-center gap-1.5'>
                            <div>
                                <TbClockEdit className='w-6 h-6' />
                            </div>
                            <div className='cursor-default'>
                                <span className='select-none'>
                                    { updatedAtFromNow }
                                </span>
                            </div>
                        </div>
                    </HoverPopover>
                </div>
            </div>
            <Outlet />
        </div>
    )
}
