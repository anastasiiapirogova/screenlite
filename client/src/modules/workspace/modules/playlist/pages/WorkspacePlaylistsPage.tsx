import { WorkspacePlaylistsPageSidebar } from '../components/WorkspacePlaylistsPageSidebar'
import { WorkspacePlaylistsPageHeader } from '../components/workspacePlaylistsPage/WorkspacePlaylistsPageHeader'
import { WorkspacePlaylistsPageContent } from '../components/workspacePlaylistsPage/WorkspacePlaylistsPageContent'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'

export const WorkspacePlaylistsPage = () => {
    return (
        <div className='flex gap-2 grow'>
            <div className='w-[325px] shrink-0'>
                <LayoutBodyContainer>
                    <WorkspacePlaylistsPageSidebar />
                </LayoutBodyContainer>
            </div>
            
            <LayoutBodyContainer>
                <ScrollArea verticalMargin={ 24 }>
                    <div className='p-7'>
                        <WorkspacePlaylistsPageHeader />
                        <WorkspacePlaylistsPageContent />
                    </div>
                </ScrollArea>
            </LayoutBodyContainer>
        </div>
    )
}
