import { LayoutBodyContainer } from "@shared/components/LayoutBodyContainer"
import { ScrollArea } from "@shared/ui/ScrollArea"
import { WorkspaceMembersList } from "../components/WorkspaceMembersList"
import { workspaceMembersQuery } from "../api/queries/workspaceMembersQuery"
import { useQuery } from "@tanstack/react-query"
import { useWorkspace } from "@modules/workspace/hooks/useWorkspace"

export const WorkspaceMembersListPage = () => {
    const workspace = useWorkspace()

    const { data: members } = useQuery(workspaceMembersQuery({
        workspaceId: workspace.id,
        filters: {
            page: 1,
            limit: 10
        }
    }))

    return (
        <LayoutBodyContainer>
            <ScrollArea verticalMargin={ 24 }>
                <div className='max-w-screen-md w-full mx-auto p-7'>
                    <div className='text-3xl mb-4'>Members</div>
                    <WorkspaceMembersList members={ members?.data || [] } />
                </div>
            </ScrollArea>
        </LayoutBodyContainer>
    )
}