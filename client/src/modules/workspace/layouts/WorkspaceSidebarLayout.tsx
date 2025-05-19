import { WorkspaceSidebar } from '@modules/workspace/components/WorkspaceSidebar'
import { Outlet } from 'react-router'

export const WorkspaceSidebarLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex grow">
                <WorkspaceSidebar />
                <div className='flex grow'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
