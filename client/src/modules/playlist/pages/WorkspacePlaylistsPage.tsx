import { InnerSidebarLayout } from '@shared/layouts/InnerSidebarLayout'
import { WorkspacePlaylistsPageSidebar } from '../components/WorkspacePlaylistsPageSidebar'
import { WorkspacePlaylistsPageHeader } from '../components/workspacePlaylistsPage/WorkspacePlaylistsPageHeader'
import { WorkspacePlaylistsPageContent } from '../components/workspacePlaylistsPage/WorkspacePlaylistsPageContent'

export const WorkspacePlaylistsPage = () => {
    return (
        <div className='flex flex-col grow w-full overflow-hidden'>
            <WorkspacePlaylistsPageHeader />
            <InnerSidebarLayout sidebar={ <WorkspacePlaylistsPageSidebar /> }>
                <WorkspacePlaylistsPageContent />
            </InnerSidebarLayout>
        </div>
    )
}
