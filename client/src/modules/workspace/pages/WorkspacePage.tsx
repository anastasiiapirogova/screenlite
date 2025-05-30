import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'

export const WorkspacePage = () => {
    return (
        <LayoutBodyContainer>
            <ScrollArea verticalMargin={ 24 }>
                <div className='p-7'></div>
            </ScrollArea>
        </LayoutBodyContainer>
    )
}
