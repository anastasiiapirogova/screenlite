import { Checkbox } from '@shared/ui/Checkbox'
import { useRouterPlaylistFilter } from '../../hooks/useRouterPlaylistFilter'
import { SidebarFilterGroup } from '@shared/components/SidebarFilterGroup'

export const PlaylistHasScreensFilter = () => {
    const { has_screens: hasScreensFilter, switchFilter, setFilter } = useRouterPlaylistFilter()

    const statuses = [
        {
            label: 'Has screens',
            value: 'true'
        },
        {
            label: 'Has no screens',
            value: 'false'
        },
    ]

    return (
        <SidebarFilterGroup
            clear={ () => setFilter('has_screens',[]) }
            label='Screens'
            showClearButton={ hasScreensFilter.length > 0 }
        >
            <div className='flex flex-col w-full'>
                { statuses.map((status) => (
                    <Checkbox
                        key={ status.value }
                        checked={ hasScreensFilter.includes(status.value) }
                        id={ status.value }
                        label={ status.label }
                        onChange={ () => switchFilter('has_screens', status.value) }
                        className='hover:bg-neutral-100 p-3 rounded-xl transition-colors'
                    />
                )) }
            </div>
        </SidebarFilterGroup>
    )
}
