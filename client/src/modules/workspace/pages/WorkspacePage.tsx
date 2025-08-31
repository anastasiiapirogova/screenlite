import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { useWorkspace } from '../hooks/useWorkspace'

const ScreenCountCard = ({ label, count }: { label: string, count: number }) => (
    <div className='bg-white rounded-3xl p-7 flex flex-col gap-2 border'>
        <span className='text-lg'>{ label }</span>
        <span className='text-3xl'>{ count }</span>
    </div>
)

export const WorkspacePage = () => {
    const workspace = useWorkspace()

    const statistics = workspace.statistics || {
        members: 0,
        playlists: 0,
        screens: 0,
        layouts: 0,
        files: {
            active: 0,
            trash: 0
        },
        invitations: {
            total: 0,
            pending: 0
        }
    }

    return (
        <LayoutBodyContainer>
            <ScrollArea verticalMargin={ 24 }>
                <ScreenCountCard
                    label='Screens'
                    count={ statistics.screens }
                />
            </ScrollArea>
        </LayoutBodyContainer>
    )
}
