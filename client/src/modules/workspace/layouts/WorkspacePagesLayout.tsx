import { Outlet } from 'react-router'
import { WorkspaceSidebar } from '../components/WorkspaceSidebar'
import { Header } from '@shared/components/Header'
import { WorkspaceHeaderButton } from '../components/WorkspaceHeaderButton'
import { ReactNode } from 'react'

export const WorkspacePagesLayout = ({ children }: { children?: ReactNode }) => {
    return (
        <div className="flex flex-col grow w-full bg-slate-100 h-screen overflow-hidden">
            <Header>
                <div>
                    <WorkspaceHeaderButton />
                </div>
            </Header>
            <div className="flex grow">
                <div className="w-[275px] p-5 flex flex-col shrink-0">
                    <WorkspaceSidebar />
                </div>
                { children ? children : <Outlet /> }		
            </div>
        </div>
    )
}
