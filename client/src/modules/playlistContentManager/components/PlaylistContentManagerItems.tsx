import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { SectionItemList } from './PlaylistSectionItemList'
import { usePlaylistContentManagerStorage } from '@stores/usePlaylistContentManagerStorage'
import { playlistItemsQuery } from '@modules/playlist/api/queries/playlistItemsQuery'
import { usePlaylist } from '@modules/playlist/hooks/usePlaylist'

const PlaylistContentManagerSectionItems = () => {
    const playlist = usePlaylist()

    const { items, initStorage, checkItemsModified } = usePlaylistContentManagerStorage()
        
    const { data: serverPlaylistItems } = useSuspenseQuery(playlistItemsQuery(playlist.id))
       
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
