import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { playlistScreensQuery } from '../api/queries/playlistScreensQuery'
import { usePlaylist } from '../hooks/usePlaylist'
import { AddScreensToPlaylistButton } from '../components/buttons/AddScreensToPlaylistButton'
import { PlaylistScreenListScreenCard } from '../components/PlaylistScreenListScreenCard'

const ScreenList = () => {
    const playlist = usePlaylist()

    const { data: screens } = useSuspenseQuery(playlistScreensQuery(playlist.id))

    return (
        <div>
            <AddScreensToPlaylistButton buttonText='Add screens'/>
            {
                screens.map(screen => (
                    <PlaylistScreenListScreenCard
                        key={ screen.id }
                        screen={ screen }
                    />
                ))
            }
        </div>
    )
}

export const WorkspacePlaylistScreensPage = () => {
    return (
        <QueryErrorResetBoundary>
            <ErrorBoundary fallbackRender={ () => (
                <div>
                    There was an error!
                </div>
            ) }
            >
                <Suspense fallback={ <>Loading</> }>
                    <ScreenList />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}
