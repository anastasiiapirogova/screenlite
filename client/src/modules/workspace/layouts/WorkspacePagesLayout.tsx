import { Link, Outlet } from 'react-router'
import { WorkspaceSidebar } from '../components/WorkspaceSidebar'
import { ScrollArea } from '@shared/ui/ScrollArea'

export const WorkspacePagesLayout = () => {
    return (
        <div className="flex flex-col grow w-full bg-slate-100 h-screen overflow-hidden">
            <div className="px-4 h-12 shrink-0 border-neutral-200 flex justify-between items-center">
                <Link to="/">
                    Screenlite
                </Link>
                <div>
                    
                </div>
            </div>
            <div className="flex grow">
                <div className="w-[275px] p-5 flex flex-col">
                    <WorkspaceSidebar />
                </div>
                <div
                    className='bg-white rounded-3xl grow flex flex-col overflow-y-auto'
                    style={ { height: 'calc(100vh - 3rem)' } }
                >
                    <ScrollArea>
                        <div className='p-7'>
                            <Outlet />
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}
