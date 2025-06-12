import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { WorkspaceMembersCard } from '../components/WorkspaceMembersCard'
import { WorkspaceInvitationsCard } from '../components/WorkspaceInvitationsCard'

export const WorkspaceMembersPage = () => {
    return (
        <LayoutBodyContainer>
            <ScrollArea verticalMargin={ 24 }>
                <div className='max-w-screen-md w-full mx-auto p-7'>
                    <div className='flex flex-col gap-5'>
                        <WorkspaceMembersCard />
                        <WorkspaceInvitationsCard />
                    </div>
                </div>
            </ScrollArea>
        </LayoutBodyContainer>
    )
}