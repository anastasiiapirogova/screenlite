import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { Pagination } from '@shared/ui/Pagination'
import { useQuery } from '@tanstack/react-query'
import { useDeferredLoading } from '@shared/hooks/useDeferredLoading'
import { useRouterScreenFilter } from '@modules/screen/hooks/useRouterScreenFilter'
import { workspaceScreensQuery } from '@modules/screen/api/queries/workspaceScreensQuery'
import { WorkspaceScreensPageList } from './WorkspaceScreensPageList'

export const WorkspaceScreensPageContent = () => {
    const workspace = useWorkspace()
    
    const { filters, setLimit, setPage } = useRouterScreenFilter()
    
    const { data, isLoading } = useQuery(workspaceScreensQuery({
        slug: workspace.slug,
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
                limit={ filters.limit }
                onLimitChange={ setLimit }
                onPageChange={ setPage }
            />
        </>
        
    )
}