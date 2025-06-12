import { WorkspaceScreensPageHeader } from '../components/workspaceScreensPage/WorkspacePlaylistsPageHeader'
import { WorkspaceScreensPageContent } from '../components/workspaceScreensPage/WorkspaceScreensPageContent'
import { WorkspaceScreensPageSidebar } from '../components/WorkspaceScreensPageSidebar'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { WorkspaceScreensEmptyStatePage } from './WorkspaceScreensEmptyStatePage'
import { ScrollArea } from '@shared/ui/ScrollArea'

export const WorkspaceScreensPage = () => {

    const workspace = useWorkspace()

    if(workspace._count.screens === 0) {
        return <WorkspaceScreensEmptyStatePage />
    }

    return (
        <div className='flex gap-2 grow'>
            <div className='w-[325px] shrink-0'>
                <LayoutBodyContainer>
                    <ScrollArea verticalMargin={ 24 }>
                        <div className='p-7'>
                            <WorkspaceScreensPageSidebar />
                        </div>
                    </ScrollArea>
                </LayoutBodyContainer>
            </div>
			
            <LayoutBodyContainer>
                <ScrollArea verticalMargin={ 24 }>
                    <div className='p-7'>
                        <WorkspaceScreensPageHeader />
                        <WorkspaceScreensPageContent />
                    </div>
                </ScrollArea>
            </LayoutBodyContainer>
        </div>
    )
}