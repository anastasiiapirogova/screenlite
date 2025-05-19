import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
// import { Pagination } from '@shared/ui/Pagination'
import { useQuery } from '@tanstack/react-query'
import { useDeferredLoading } from '@shared/hooks/useDeferredLoading'
import { workspaceMembersQuery } from '@modules/members/api/queries/workspaceMembersQuery'
import { WorkspaceMembersPageList } from './WorkspaceMembersPageList'

export const WorkspaceMembersPageContent = () => {
    const workspace = useWorkspace()
    
    const { data, isLoading } = useQuery(workspaceMembersQuery({
        slug: workspace.slug,
        filters: {}
    }))

    const deferredIsLoading = useDeferredLoading(isLoading, { delay: 0, minDuration: 500 })

    return (
        <>
            <WorkspaceMembersPageList
                data={ data }
                isLoading={ deferredIsLoading }
            />
            { /* <Pagination
                page={ filters.page }
                pages={ data?.meta.pages }
                onPageChange={ (value) => setFilter('page', value.toString()) }
            /> */ }
        </>
        
    )
}