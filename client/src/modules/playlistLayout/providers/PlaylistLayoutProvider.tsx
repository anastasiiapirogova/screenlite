import { Outlet, useParams } from 'react-router'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { PlaylistLayoutContext } from '../contexts/PlaylistLayoutContext'
import { playlistLayoutQuery } from '../api/requests/playlistLayoutRequest'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'

const PlaylistLayoutProviderContent = () => {
    const params = useParams<{ playlistLayoutId: string }>()
    const workspace = useWorkspace()

    const { data: screen } = useSuspenseQuery(playlistLayoutQuery({
        playlistLayoutId: params.playlistLayoutId!,
        workspaceId: workspace.id
    }))

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
