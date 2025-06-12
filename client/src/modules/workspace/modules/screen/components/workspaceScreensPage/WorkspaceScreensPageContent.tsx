import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { Pagination } from '@shared/ui/Pagination'
import { useQuery } from '@tanstack/react-query'
import { useDeferredLoading } from '@shared/hooks/useDeferredLoading'
import { useRouterScreenFilter } from '@modules/workspace/modules/screen/hooks/useRouterScreenFilter'
import { workspaceScreensQuery } from '@modules/workspace/modules/screen/api/queries/workspaceScreensQuery'
import { WorkspaceScreensPageList } from './WorkspaceScreensPageList'

export const WorkspaceScreensPageContent = () => {
    const workspace = useWorkspace()
    
    const { filters, setPage } = useRouterScreenFilter()
    
    const { data, isLoading } = useQuery(workspaceScreensQuery({
        workspaceId: workspace.id,
        filters
    }))

    const deferredIsLoading = useDeferredLoading(isLoading, { delay: 0, minDuration: 500 })

    return (
        <>
            <WorkspaceScreensPageList
                data={ data }
                isLoading={ deferredIsLoading }
            />
            <Pagination
                page={ filters.page }
                pages={ data?.meta.pages }
                onPageChange={ setPage }
            />
        </>
        
    )
}