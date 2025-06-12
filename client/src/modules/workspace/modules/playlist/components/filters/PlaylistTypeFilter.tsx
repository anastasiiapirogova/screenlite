import { Checkbox } from '@shared/ui/Checkbox'
import { getPlaylistTypeOptions } from '../../utils/playlistTypes.js'
import { useRouterPlaylistFilter } from '../../hooks/useRouterPlaylistFilter.js'
import { SidebarFilterGroup } from '@shared/components/SidebarFilterGroup.js'

export const PlaylistTypeFilter = () => {
    const { type: typeFilter, switchFilter, setFilter } = useRouterPlaylistFilter()

    const types = getPlaylistTypeOptions()

    return (
        <SidebarFilterGroup
            clear={ () => setFilter('type', []) }
            label='Type'
            showClearButton={ typeFilter.length > 0 }
        >
            <div className='flex flex-col w-full'>
                { types.map((type) => (
                    <Checkbox
                        key={ type.value }
                        checked={ typeFilter.includes(type.value) }
                        id={ type.value }
                        label={ type.label }
                        onChange={ () => switchFilter('type', type.value) }
                        className='hover:bg-neutral-100 p-3 rounded-xl transition-colors'
                    />
                )) }
            </div>
        </SidebarFilterGroup>
    )
}
