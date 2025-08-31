import { WorkspaceScreensResponse } from '@modules/screen/api/requests/workspaceScreensRequest'
import { useRouterScreenFilter } from '@modules/screen/hooks/useRouterScreenFilter'

export const WorkspaceScreensPageList = ({ data, isLoading }: { data?: WorkspaceScreensResponse, isLoading: boolean }) => {
    const { filters } = useRouterScreenFilter()

    if (isLoading || !data) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    const { meta, items: screens } = data

    const pageExists = filters.page <= meta.totalPages

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
            screens
        </div>
    )
}