import { useEffect, useState } from 'react'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { WorkspaceScreensPageHeader } from '../components/workspaceScreensPage/WorkspacePlaylistsPageHeader'
import { WorkspaceScreensPageContent } from '../components/workspaceScreensPage/WorkspaceScreensPageContent'
import { WorkspaceScreensPageSidebar } from '../components/WorkspaceScreensPageSidebar'
import { WorkspaceScreensEmptyStatePage } from './WorkspaceScreensEmptyStatePage'
import { ScrollArea } from '@shared/ui/ScrollArea'

export const WorkspaceScreensPage = () => {
    const workspace = useWorkspace()

    const [sidebarVisible, setSidebarVisible] = useState(true)
    const [sidebarMounted, setSidebarMounted] = useState(true)

    const toggleSidebar = () => {
        if (sidebarVisible) {
            setSidebarVisible(false)
            setTimeout(() => {
                setSidebarMounted(false)
            }, 300)
        } else {
            setSidebarMounted(true)
        }
    }

    useEffect(() => {
        if (sidebarMounted && !sidebarVisible) {
            const timeout = setTimeout(() => {
                setSidebarVisible(true)
            }, 10)

            return () => clearTimeout(timeout)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sidebarMounted])

    if (workspace._count.screens === 0) {
        return <WorkspaceScreensEmptyStatePage />
    }

    return (
        <div className='flex gap-2 grow'>
            { sidebarMounted && (
                <div
                    className="relative transition-all duration-300 ease-in-out overflow-hidden shrink-0"
                    style={ {
                        width: sidebarVisible ? '325px' : '0px',
                        opacity: sidebarVisible ? 1 : 0,
                    } }
                >
                    <div className="absolute inset-0 w-[325px]">
                        <LayoutBodyContainer>
                            <ScrollArea verticalMargin={ 24 }>
                                <div className="p-7">
                                    <WorkspaceScreensPageSidebar />
                                </div>
                            </ScrollArea>
                        </LayoutBodyContainer>
                    </div>
                </div>
            ) }

            <LayoutBodyContainer>
                <WorkspaceScreensPageHeader toggleSidebar={ toggleSidebar } />
                <ScrollArea verticalMargin={ 24 }>
                    <WorkspaceScreensPageContent />
                </ScrollArea>
            </LayoutBodyContainer>
        </div>
    )
}
