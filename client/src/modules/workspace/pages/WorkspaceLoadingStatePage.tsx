import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { WorkspacePagesLayout } from '../layouts/WorkspacePagesLayout'
import { ScrollArea } from '@shared/ui/ScrollArea'

export const WorkspaceLoadingStatePage = () => {
    return (
        <WorkspacePagesLayout>
            <LayoutBodyContainer>
                <ScrollArea verticalMargin={ 24 }>
                    <div className='p-7'>
                        Loading
                    </div>
                </ScrollArea>
            </LayoutBodyContainer>
        </WorkspacePagesLayout>
    )
}
