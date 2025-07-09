import { Button } from '@shared/ui/buttons/Button'
import { CreateScreenButton } from '../CreateScreenButton'
import { useSidebarStore } from '@stores/useSidebarStore'

export const WorkspaceScreensPageHeader = () => {
    const SIDEBAR_KEY = 'workspaceScreens'
    
    const toggleSidebar = () => useSidebarStore.getState().toggleSidebar(SIDEBAR_KEY)

    return (
        <div className='flex items-center'>
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
        </div>
    )
}