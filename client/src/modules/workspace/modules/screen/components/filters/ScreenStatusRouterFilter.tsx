import { ScreenStatus } from '../../types'
import { useRouterScreenFilter } from '../../hooks/useRouterScreenFilter'
import { Checkbox } from '@shared/ui/Checkbox'
import { SidebarFilterGroup } from '@shared/components/SidebarFilterGroup'

export const ScreenStatusRouterFilter = () => {
    const { filters, setStatusFilter, switchStatusFilter } = useRouterScreenFilter()

    const statusFilter = filters.status

    const statuses: { label: string; value: ScreenStatus | '' }[] = [
        {
            label: 'Online',
            value: 'online'
        },
        {
            label: 'Offline',
            value: 'offline'
        },
        {
            label: 'Connected',
            value: 'connected'
        },
        {
            label: 'Not connected',
            value: 'not_connected'
        },
    ]

    return (
        <SidebarFilterGroup
            clear={ () => setStatusFilter([]) }
            label='Status'
            showClearButton={ statusFilter.length > 0 }
        >
            <div className='flex flex-col w-full'>
                { statuses.map((type) => (
                    <Checkbox
                        key={ type.value }
                        checked={ statusFilter.includes(type.value) }
                        id={ type.value }
                        label={ type.label }
                        onChange={ () => switchStatusFilter(type.value) }
                        className='hover:bg-neutral-100 p-3 rounded-xl transition-colors'
                    />
                )) }
            </div>
        </SidebarFilterGroup>
    )
}