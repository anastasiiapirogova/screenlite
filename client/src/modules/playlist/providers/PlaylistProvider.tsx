import { Outlet, useParams } from 'react-router'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { playlistQuery } from '../api/queries/playlistQuery'
import { PlaylistContext } from '../contexts/PlaylistContext'

const PlaylistProviderContent = () => {
    const params = useParams<{ playlistId: string }>()
    const { data: screen } = useSuspenseQuery(playlistQuery(params.playlistId!))

    return (
        <PlaylistContext.Provider value={ screen }>
            <Outlet />
        </PlaylistContext.Provider>
    )
}

export const PlaylistProvider = () => {
    return (
        <QueryErrorResetBoundary>
            <ErrorBoundary fallbackRender={ () => (
                <div>
                    There was an error!
                </div>
            ) }
            >
                <Suspense fallback={ <div>loading</div> }>
                    <PlaylistProviderContent />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}
