import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { usePlaylistLayout } from '../hooks/usePlaylistLayout'
import { Link } from 'react-router'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { playlistLayoutPlaylistsQuery } from '../api/playlistLayoutPlaylistsRequest'

const PlaylistsList = () => {
    const { id, workspaceId } = usePlaylistLayout()
    const { data: playlists } = useSuspenseQuery(playlistLayoutPlaylistsQuery({
        playlistLayoutId: id,
        workspaceId: workspaceId
    }))
    const routes = useWorkspaceRoutes()

    return (
        <div>
            { playlists.map((playlist) => (
                <Link
                    to={ routes.playlist(playlist.id) }
                    key={ playlist.id }
                >
                    { playlist.name }
                </Link>
            )) }
        </div>
    )
}

export const WorkspacePlaylistLayoutPlaylistsPage = () => {
    return (
        <QueryErrorResetBoundary>
            <ErrorBoundary fallbackRender={ () => (
                <div>
                    There was an error!
                </div>
            ) }
            >
                <Suspense fallback={ <>Loading</> }>
                    <PlaylistsList />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}
