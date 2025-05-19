import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { useScreen } from '../hooks/useScreen'
import { screenPlaylistsQuery } from '../api/queries/screenPlaylistsQuery'
import { Link } from 'react-router'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense } from 'react'

const PlaylistList = () => {
    const screen = useScreen()
    const { data: playlists } = useSuspenseQuery(screenPlaylistsQuery(screen.id))
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

export const WorkspaceScreenPlaylistsPage = () => {
    return (
        <QueryErrorResetBoundary>
            <ErrorBoundary fallbackRender={ () => (
                <div>
                    There was an error!
                </div>
            ) }
            >
                <Suspense fallback={ <>Loading</> }>
                    <PlaylistList />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}
