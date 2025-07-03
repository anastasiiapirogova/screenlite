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

const ItemsCard = () => {
    const { _count, id } = usePlaylist()
    const routes = useWorkspaceRoutes()
    const itemCount = _count.items

    return (
        <EntityPageCard
            title="Items"
            className="h-full flex flex-col justify-between"
        >
            <div className="flex flex-col gap-2 grow justify-center">
                <span className="text-4xl font-bold">{ itemCount }</span>
                <span className="text-lg text-neutral-500">{ pluralize('item', itemCount) }</span>
            </div>
            <div className="mt-4">
                <Button
                    color='secondary'
                    variant='soft'
                    to={ routes.playlistContentManager(id) }
                    className="w-full"
                >
                    Manage content
                </Button>
            </div>
        </EntityPageCard>
    )
}

const LayoutCard = () => {
    return (
        <PlaylistPageLayoutCard />
    )
}

const SizeCard = () => {
    const { size } = usePlaylist()

    return (
        <EntityPageCard
            title="Size"
            className="h-full flex flex-col justify-center items-start"
        >
            <span className="text-4xl font-bold">{ prettySize(size) }</span>
            <span className="text-lg text-neutral-500 mt-2">Total size</span>
        </EntityPageCard>
    )
}

const StatusCard = () => {
    const { isPublished } = usePlaylist()

    return (
        <EntityPageCard
            title="Status"
            className="h-full flex flex-col justify-between"
        >
            <div className="flex flex-col gap-2 grow justify-center">
                <span className={ twMerge(
                    'text-2xl font-semibold',
                    isPublished ? 'text-blue-500' : 'text-neutral-400'
                ) }
                >
                    { isPublished ? 'Published' : 'Draft' }
                </span>
            </div>
            <div className="mt-4">
                <SwitchPlaylistStatusButton />
            </div>
        </EntityPageCard>
    )
}

export const WorkspacePlaylistPage = () => {
    return (
        <div className='p-7'>
            <div className='flex gap-2 justify-end mb-5'>
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
            <div className='grid grid-cols-2 gap-5'>
                <ItemsCard />
                <LayoutCard />
                <SizeCard />
                <StatusCard />
            </div>
        </div>
    )
}
