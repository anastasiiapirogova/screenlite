import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { SectionItemList } from './PlaylistSectionItemList'
import { usePlaylistContentManagerStorage } from '@stores/usePlaylistContentManagerStorage'
import { usePlaylist } from '@modules/workspace/modules/playlist/hooks/usePlaylist'
import { playlistItemsQuery } from '@workspaceModules/playlist/api/requests/playlistItemsRequest'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'

const PlaylistContentManagerSectionItems = () => {
    const playlist = usePlaylist()
    const workspace = useWorkspace()
    const { items, initStorage, checkItemsModified } = usePlaylistContentManagerStorage()
        
    const { data: serverPlaylistItems } = useSuspenseQuery(playlistItemsQuery({
        playlistId: playlist.id,
        workspaceId: workspace.id
    }))
       
    useEffect(() => {
        checkItemsModified(serverPlaylistItems)
    }, [items, serverPlaylistItems, checkItemsModified])
    
    useEffect(() => {
        if(!items) {
            initStorage(serverPlaylistItems)
        }
    }, [items, initStorage, playlist, serverPlaylistItems])

    return (
        <SectionItemList />
    )
}

export const PlaylistContentManagerItems = () => {
    return (
        <QueryErrorResetBoundary>
            <ErrorBoundary fallbackRender={ () => (
                <div>
                    There was an error!
                </div>
            ) }
            >
                <Suspense fallback={ <>Loading</> }>
                    <PlaylistContentManagerSectionItems />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}
