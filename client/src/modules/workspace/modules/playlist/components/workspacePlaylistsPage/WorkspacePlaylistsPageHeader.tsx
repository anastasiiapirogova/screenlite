import { ListPageHeader } from '@shared/components/ListPageHeader'
import { useSearchCountStore } from '@stores/useSearchCountStore'
import { CreatePlaylistButton } from '../buttons/CreatePlaylistButton'
import { Button } from '@shared/ui/buttons/Button'

export const WorkspacePlaylistsPageHeader = () => {
    const { playlistCount } = useSearchCountStore()

    return (
        <ListPageHeader
            title='Playlists'
            count={ playlistCount }
        >
            <CreatePlaylistButton>
                <Button variant='soft'>
                    Create playlist
                </Button>
            </CreatePlaylistButton>
        </ListPageHeader>
    )
}