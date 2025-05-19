import { Outlet, useParams } from 'react-router'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { playlistLayoutQuery } from '../api/queries/playlistLayoutQuery'
import { PlaylistLayoutContext } from '../contexts/PlaylistLayoutContext'

const PlaylistLayoutProviderContent = () => {
    const params = useParams<{ playlistLayoutId: string }>()

    const { data: screen } = useSuspenseQuery(playlistLayoutQuery(params.playlistLayoutId!))

    return (
        <PlaylistLayoutContext.Provider value={ screen }>
            <Outlet />
        </PlaylistLayoutContext.Provider>
    )
}

export const PlaylistLayoutProvider = () => {
    return (
        <QueryErrorResetBoundary>
            <ErrorBoundary fallbackRender={ () => (
                <div>
                    There was an error!
                </div>
            ) }
            >
                <Suspense fallback={ <div>loading</div> }>
                    <PlaylistLayoutProviderContent />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}
