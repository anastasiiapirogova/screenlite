import { Button } from '@shared/ui/buttons/Button'
import { EditPlaylistDetailsButton } from '../components/buttons/EditPlaylistDetailsButton'
import { usePlaylist } from '../hooks/usePlaylist'
import { CopyPlaylistButton } from '../components/buttons/CopyPlaylistButton'
import { DeletePlaylistButton } from '../components/buttons/DeletePlaylistButton'
import { prettySize } from '@shared/helpers/prettySize'
import pluralize from 'pluralize'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { PlaylistPageLayoutCard } from '../components/cards/PlaylistPageLayoutCard'
import { EntityPageCard } from '@shared/components/EntityPageCard'
import { twMerge } from 'tailwind-merge'
import { SwitchPlaylistStatusButton } from '../components/buttons/SwitchPlaylistStatusButton'
import { RestorePlaylistButton } from '../components/buttons/RestorePlaylistButton'

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

const Status = () => {
    const { isPublished } = usePlaylist()

    return (
        <EntityPageCard title="Status">
            <div className={
                twMerge(
                    'flex h-16 items-center',
                    isPublished ? 'text-blue-500' : 'text-neutral-500'
                )
            }
            >
                {
                    isPublished ? 'Published' : 'Draft'
                }
            </div>
            <div>
                <SwitchPlaylistStatusButton />
            </div>
        </EntityPageCard>
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
                <RestorePlaylistButton>
                    <Button
                        color='secondary'
                        variant='soft'
                    >
                        Restore
                    </Button>
                </RestorePlaylistButton>
            </div>
            <div className='flex gap-5 mt-5'>
                <PlaylistPageLayoutCard />
                <div className='w-1/2'>
                    <Items />
                    <Status />
                </div>
                <div className='w-1/2'>
                    <Size />
                </div>
            </div>
        </div>
    )
}
