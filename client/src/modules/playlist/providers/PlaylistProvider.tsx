import { Outlet, useParams } from 'react-router'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { playlistQuery } from '../api/queries/playlistQuery'
import { PlaylistContext } from '../contexts/PlaylistContext'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'

const PlaylistProviderContent = () => {
    const params = useParams<{ playlistId: string }>()
    const workspace = useWorkspace()
    
    const { data: playlist } = useSuspenseQuery(playlistQuery({
        playlistId: params.playlistId!,
        workspaceId: workspace.id
    }))

    return (
        <PlaylistContext.Provider value={ playlist }>
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
