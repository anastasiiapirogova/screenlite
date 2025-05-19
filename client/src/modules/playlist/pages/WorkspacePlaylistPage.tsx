import { Button } from '@shared/ui/buttons/Button'
import { EditPlaylistDetailsButton } from '../components/buttons/EditPlaylistDetailsButton'
import { usePlaylist } from '../hooks/usePlaylist'
import { CopyPlaylistButton } from '../components/buttons/CopyPlaylistButton'
import { DeletePlaylistButton } from '../components/buttons/DeletePlaylistButton'
import { prettySize } from '@shared/helpers/prettySize'
import pluralize from 'pluralize'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'

const Items = () => {
    const { _count, id } = usePlaylist()
    const routes = useWorkspaceRoutes()
    const itemCount = _count.items

    return (
        <div className='p-5 border rounded-2xl'>
            <div className='text-xl font-semibold'>
                Content
            </div>
            <div className='flex gap-2 text-lg justify-between min-h-12 grow items-center'>
                { itemCount === 0 ? (
                    <div>
                        Playlist is empty
                    </div>
                ) : (
                    <div>
                        { pluralize('item', itemCount, true) }
                    </div>
                ) }
            </div>
            <Button
                color='secondary'
                variant='soft'
                to={ routes.playlistContentManager(id) }
            >
                Manage content
            </Button>
        </div>
    )
}

const Size = () => {
    const { size } = usePlaylist()

    return (
        <div className='p-5 border rounded-2xl'>
            <div className='text-xl font-semibold'>
                Size
            </div>
            <div className='flex gap-2 text-lg justify-between min-h-12 grow items-center'>
                { prettySize(size) }
            </div>
        </div>
    )
}

export const WorkspacePlaylistPage = () => {
    return (
        <div>
            <div className='flex gap-2 justify-end'>
                <EditPlaylistDetailsButton>
                    <Button
                        color='secondary'
                        variant='soft'
                    >
                        Edit
                    </Button>
                </EditPlaylistDetailsButton>
                <CopyPlaylistButton>
                    <Button
                        color='secondary'
                        variant='soft'
                    >
                        Make a copy
                    </Button>
                </CopyPlaylistButton>
                <DeletePlaylistButton>
                    <Button
                        color='secondary'
                        variant='soft'
                    >
                        Delete
                    </Button>
                </DeletePlaylistButton>
            </div>
            <div className='flex gap-5 mt-5'>
                <div className='w-1/2'>
                    <Items />
                </div>
                <div className='w-1/2'>
                    <Size />
                </div>
            </div>
        </div>
    )
}
