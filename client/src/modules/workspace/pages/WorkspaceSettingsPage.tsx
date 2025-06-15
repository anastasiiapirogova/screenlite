import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'

export const WorkspaceSettingsPage = () => {
    return (
        <LayoutBodyContainer>
            <ScrollArea verticalMargin={ 24 }>
                <div className='p-7'>
                    Settings
                </div>
            </ScrollArea>
        </LayoutBodyContainer>
    )
}
