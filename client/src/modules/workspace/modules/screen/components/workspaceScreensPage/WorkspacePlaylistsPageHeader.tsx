import { ListPageHeader } from '@shared/components/ListPageHeader'
import { useSearchCountStore } from '@stores/useSearchCountStore'
import { Button } from '@shared/ui/buttons/Button'
import { CreateScreenButton } from '../CreateScreenButton'

export const WorkspaceScreensPageHeader = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
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
            <button
                onClick={ toggleSidebar }
                className="mb-4 px-4 py-2 bg-gray-200 rounded"
            >
                Filters
            </button>
        </ListPageHeader>
    )
}