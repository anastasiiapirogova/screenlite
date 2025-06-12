import { SidebarFilterGroup } from '@shared/components/SidebarFilterGroup.js'
import { screenTypes } from '../../helper/screenTypes.js'
import { useRouterScreenFilter } from '../../hooks/useRouterScreenFilter.js'
import { Checkbox } from '@shared/ui/Checkbox.js'

export const ScreenTypeRouterFilter = () => {
    const { filters, setTypeFilter, switchTypeFilter } = useRouterScreenFilter()

    const typeFilter = filters.type

    return (
        <SidebarFilterGroup
            clear={ () => setTypeFilter([]) }
            label='Type'
            showClearButton={ typeFilter.length > 0 }
        >
            <div className='flex flex-col w-full'>
                { screenTypes.map((type) => (
                    <Checkbox
                        key={ type.value }
                        checked={ typeFilter.includes(type.value) }
                        id={ type.value }
                        label={ type.label }
                        onChange={ () => switchTypeFilter(type.value) }
                        className='hover:bg-neutral-100 p-3 rounded-xl transition-colors'
                    />
                )) }
            </div>
        </SidebarFilterGroup>
    )
}