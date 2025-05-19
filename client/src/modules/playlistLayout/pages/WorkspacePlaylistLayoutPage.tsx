import { EntityPageCard } from '@shared/components/EntityPageCard'
import { usePlaylistLayout } from '../hooks/usePlaylistLayout'
import pluralize from 'pluralize'
import { prettyResolution } from '@shared/helpers/prettyResolution'
import { PlaylistLayoutPreview } from '../components/PlaylistLayoutPreview'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { DeletePlaylistLayoutButton } from '../components/DeletePlaylistLayoutButton'
import { Button } from '@shared/ui/buttons/Button'

const Layout = () => {
    const { sections, id, resolutionWidth, resolutionHeight } = usePlaylistLayout()
    const routes = useWorkspaceRoutes()
    const resolution = {
        width: resolutionWidth,
        height: resolutionHeight
    }

    return (
        <EntityPageCard
            title="Layout"
            to={ routes.playlistLayoutEditor(id) }
            actionName='Edit layout'
        >
            <div className='flex gap-2 text-3xl justify-between min-h-16 items-center'>
                <div>
                    { prettyResolution(resolution) }
                </div>
                <div>
                    { pluralize('section', sections.length, true) }
                </div>
            </div>
        </EntityPageCard>
    )
}

const Playlists = () => {
    const { _count, id } = usePlaylistLayout()
    const routes = useWorkspaceRoutes()
    const playlistCount = _count.playlists

    return (
        <EntityPageCard
            title="Used in"
            to={ routes.playlistLayoutPlaylists(id) }
            actionName='View playlists'
        >
            <div className='flex gap-2 text-3xl justify-between min-h-16 items-center'>
                <div>
                    { pluralize('playlist', playlistCount, true) }
                </div>
            </div>
        </EntityPageCard>
    )
}

export const WorkspacePlaylistLayoutPage = () => {
    const playlistLayout = usePlaylistLayout()

    return (
        <div className='flex flex-col gap-10'>
            <DeletePlaylistLayoutButton>
                <Button>Delete</Button>
            </DeletePlaylistLayoutButton>
            <div className='grid grid-cols-2 gap-5'>
                <div className='flex flex-col gap-5'>
                    <EntityPageCard title="Layout preview">
                        <div className='aspect-video mt-5'>
                            <PlaylistLayoutPreview playlistLayout={ playlistLayout }/>
                        </div>
                    </EntityPageCard>
                </div>
                <div className='flex flex-col gap-5'>
                    <Layout />
                    <Playlists />
                </div>
            </div>
        </div>
    )
}
