import { CreatePlaylistButton } from '../buttons/CreatePlaylistButton'
import { Button } from '@shared/ui/buttons/Button'

export const WorkspacePlaylistsPageHeader = () => {
    return (
        <>
            <CreatePlaylistButton>
                <Button variant='soft'>
                    Create playlist
                </Button>
            </CreatePlaylistButton>
        </>
    )
}