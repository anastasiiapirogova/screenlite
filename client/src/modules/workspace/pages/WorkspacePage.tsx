import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { useWorkspace } from '../hooks/useWorkspace'
import { workspaceEntityCountsQuery } from '../api/queries/workspaceEntityCountsQuery'
import { useSuspenseQuery } from '@tanstack/react-query'

const ScreenCountCard = ({ label, count }: { label: string, count: number }) => (
    <div className='bg-white rounded-3xl p-7 flex flex-col gap-2 border'>
        <span className='text-lg'>{ label }</span>
        <span className='text-3xl'>{ count }</span>
    </div>
)

export const WorkspacePage = () => {
    const workspace = useWorkspace()

    const { data: entityCounts } = useSuspenseQuery(workspaceEntityCountsQuery(workspace.id))

    const screenStatus = entityCounts.screenStatus || { online: 0, offline: 0 }

    const totalConnectedScreens = screenStatus.online + screenStatus.offline

    return (
        <LayoutBodyContainer>
            <ScrollArea verticalMargin={ 24 }>
                <div className='max-w-screen-lg w-full mx-auto p-5 flex flex-col gap-5'>
                    <div className='my-5'>
                        <div className='text-2xl'>
                            Screens
                        </div>
                    </div>
                    <div className='gap-5 grid grid-cols-3'>
                        <ScreenCountCard
                            label='Connected screens'
                            count={ totalConnectedScreens }
                        />
                        <ScreenCountCard
                            label='Online screens'
                            count={ screenStatus.online }
                        />
                        <ScreenCountCard
                            label='Offline screens'
                            count={ screenStatus.offline }
                        />
                    </div>
                </div>
        
            </ScrollArea>
        </LayoutBodyContainer>
    )
}
