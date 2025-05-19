import { WorkspaceMembersPageContent } from '../components/workspaceMembersPage/WorkspaceMembersPageContent'
import { WorkspaceMembersPageHeader } from '../components/workspaceMembersPage/WorkspaceMembersPageHeader'

export const WorkspaceMembersPage = () => {
    return (
        <div className='flex flex-col grow w-full overflow-hidden'>
            <WorkspaceMembersPageHeader />
            <WorkspaceMembersPageContent />
        </div>
    )
}
