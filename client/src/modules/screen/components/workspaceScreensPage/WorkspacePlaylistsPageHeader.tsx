import { ListPageHeader } from '@shared/components/ListPageHeader'
import { useSearchCountStore } from '@stores/useSearchCountStore'
import { Button } from '@shared/ui/buttons/Button'
import { CreateScreenButton } from '../CreateScreenButton'

export const WorkspaceScreensPageHeader = () => {
    const { screenCount } = useSearchCountStore()

    return (
        <ListPageHeader
            title='Screens'
            count={ screenCount }
        >
            <CreateScreenButton>
                <Button variant='soft'>
                    Create screen
                </Button>
            </CreateScreenButton>
        </ListPageHeader>
    )
}