import { Outlet } from 'react-router'
import { WorkspacePlaylistPageSidebar } from '../components/WorkspacePlaylistPageSidebar'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'

export const WorkspacePlaylistLayout = () => {
    return (
        <div className='flex gap-2 grow'>
            <div className='w-[325px] shrink-0'>
                <LayoutBodyContainer>
                    <ScrollArea verticalMargin={ 24 }>
                        <div className='p-7'>
                            <WorkspacePlaylistPageSidebar />
                        </div>
                    </ScrollArea>
                </LayoutBodyContainer>
            </div>
            <LayoutBodyContainer>
                <ScrollArea verticalMargin={ 24 }>
                    <Outlet />
                </ScrollArea>
            </LayoutBodyContainer>
        </div>
    )
}

