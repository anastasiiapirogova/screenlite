import { useSearchCountStore } from '@stores/useSearchCountStore'
import { useShallow } from 'zustand/react/shallow'
import { useEffect } from 'react'
import { WorkspaceScreensResponse } from '@modules/workspace/modules/screen/api/requests/workspaceScreensRequest'
import { useRouterScreenFilter } from '@modules/workspace/modules/screen/hooks/useRouterScreenFilter'
import { Screen } from '@workspaceModules/screen/types'
import { Table } from '@shared/ui/table/Table'

const screenColumns = [
    {
        key: 'name',
        header: 'Name',
        render: (screen: Screen) => screen.name,
    },
]

export const WorkspaceScreensPageList = ({ data, isLoading }: { data?: WorkspaceScreensResponse, isLoading: boolean }) => {
    const setscreenCount = useSearchCountStore(useShallow(state => state.setScreenCount))

    const { filters } = useRouterScreenFilter()

    useEffect(() => {
        if(data?.meta) {
            setscreenCount(data.meta.total)
        }
    }, [data, setscreenCount])

    if (isLoading || !data) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    const { meta, data: screens } = data

    const pageExists = filters.page <= meta.pages

    if(!pageExists) {
        return (
            <div>
                Page not found
            </div>
        )
    }

    if(screens.length === 0) {
        return (
            <div>
                No screens found
            </div>
        )
    }

    return (
        <div className='px-3.5'>
            <Table
                columns={ screenColumns }
                data={ screens }
                rowKey={ (screen) => screen.id }
                columnCellClassName='px-3.5'
                columnHeaderClassName='px-3.5'
                containerClassName='relative'
                rowClassName='border-b border-gray-200 h-20 items-center hover:bg-neutral-100'
                headerClassName='h-20 items-center text-sm sticky top-0 bg-white border-b border-gray-200'
            />
        </div>
    )
}