import { Checkbox } from '@shared/ui/Checkbox'
import { useRouterPlaylistFilter } from '../../hooks/useRouterPlaylistFilter'
import { SidebarFilterGroup } from '@shared/components/SidebarFilterGroup'

export const PlaylistHasContentFilter = () => {
    const { has_content: hasContentFilter, switchFilter, setFilter } = useRouterPlaylistFilter()

    const statuses = [
        {
            label: 'Has content',
            value: 'true'
        },
        {
            label: 'Has no content',
            value: 'false'
        },
    ]

    return (
        <SidebarFilterGroup
            clear={ () => setFilter('has_content', []) }
            label='Content'
            showClearButton={ hasContentFilter.length > 0 }
        >
            <div className='flex flex-col w-full'>
                { statuses.map((status) => (
                    <Checkbox
                        key={ JSON.stringify(status) }
                        checked={ hasContentFilter.includes(status.value) }
                        id={ JSON.stringify(status) }
                        label={ status.label }
                        onChange={ () => switchFilter('has_content', status.value) }
                        className='hover:bg-neutral-100 p-3 rounded-xl transition-colors'
                    />
                )) }
            </div>
        </SidebarFilterGroup>
    )
}
