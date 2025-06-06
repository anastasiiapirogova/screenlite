import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { EmptyState } from '@shared/ui/EmptyState'
import { CreateScreenButton } from '../components/CreateScreenButton'
import { Button } from '@shared/ui/buttons/Button'

export const WorkspaceScreensEmptyStatePage = () => {
    return (
        <LayoutBodyContainer>
            <div className='flex grow'>
                <EmptyState
                    description='Create a screen to get started'
                    header='No screens found'
                    primaryAction={
                        <CreateScreenButton>
                            <Button>
                                Create screen
                            </Button>
                        </CreateScreenButton>
                    }
                />
            </div>
        </LayoutBodyContainer>
    )
}
