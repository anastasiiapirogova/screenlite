import { Checkbox } from '@shared/ui/Checkbox'
import { useRouterPlaylistFilter } from '../../hooks/useRouterPlaylistFilter'
import { SidebarFilterGroup } from '@shared/components/SidebarFilterGroup'

export const PlaylistStatusFilter = () => {
    const { status: statusFilter, switchFilter, setFilter } = useRouterPlaylistFilter()

    const statuses = [
        {
            label: 'Published',
            value: 'published'
        },
        {
            label: 'Draft',
            value: 'draft'
        },
        {
            label: 'Deleted',
            value: 'deleted'
        },
    ]

    return (
        <SidebarFilterGroup
            clear={ () => setFilter('status', []) }
            label='Status'
            showClearButton={ statusFilter.length > 0 }
        >
            <div className='flex flex-col w-full'>
                { statuses.map((status) => (
                    <Checkbox
                        key={ status.value }
                        checked={ statusFilter.includes(status.value) }
                        id={ status.value }
                        label={ status.label }
                        onChange={ () => switchFilter('status', status.value) }
                        className='hover:bg-neutral-100 p-3 rounded-xl transition-colors'
                    />
                )) }
            </div>
        </SidebarFilterGroup>
    )
}
