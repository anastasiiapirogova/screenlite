import { useSearchCountStore } from '@stores/useSearchCountStore'
import { useShallow } from 'zustand/react/shallow'
import { useEffect } from 'react'
import { WorkspaceScreensResponse } from '@modules/workspace/modules/screen/api/requests/workspaceScreensRequest'
import { WorkspaceScreensScreenCard } from '../WorkspaceScreensScreenCard'
import { useRouterScreenFilter } from '@modules/workspace/modules/screen/hooks/useRouterScreenFilter'

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
        <div>
            <div className='flex flex-col gap-2'>
                {
                    screens.map(
                        screen => (
                            <WorkspaceScreensScreenCard
                                key={ screen.id }
                                screen={ screen }
                            />
                        )
                    )
                }
            </div>
        </div>
    )
}