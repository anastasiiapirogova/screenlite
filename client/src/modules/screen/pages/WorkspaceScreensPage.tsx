import { InnerSidebarLayout } from '@shared/layouts/InnerSidebarLayout'
import { WorkspaceScreensPageHeader } from '../components/workspaceScreensPage/WorkspacePlaylistsPageHeader'
import { WorkspaceScreensPageContent } from '../components/workspaceScreensPage/WorkspaceScreensPageContent'
import { WorkspaceScreensPageSidebar } from '../components/WorkspaceScreensPageSidebar'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { EmptyState } from '@shared/ui/EmptyState'
import { CreateScreenButton } from '../components/CreateScreenButton'
import { Button } from '@shared/ui/buttons/Button'

export const WorkspaceScreensPage = () => {
    const workspace = useWorkspace()

    if(workspace._count.screens === 0) {
        return (
            <EmptyState
                description='Create a screen to get started'
                header='No screens found'
                primaryAction={
                    <CreateScreenButton>
                        <Button>
                            Create screen
                        </Button>
                    </CreateScreenButton>
                }
            />
        )
    }

    return (
        <div className='flex flex-col grow max-w-(--breakpoint-xl) mx-auto w-full px-10 gap-5 overflow-hidden'>
            <WorkspaceScreensPageHeader />
            <InnerSidebarLayout sidebar={ <WorkspaceScreensPageSidebar /> }>
                <WorkspaceScreensPageContent />
            </InnerSidebarLayout>
        </div>
    )
}
