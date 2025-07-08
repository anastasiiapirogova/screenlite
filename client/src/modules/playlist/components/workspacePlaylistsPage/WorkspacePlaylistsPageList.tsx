import { useSearchCountStore } from '@stores/useSearchCountStore'
import { WorkspacePlaylistsPlaylistCard } from '../WorkspacePlaylistsPlaylistCard'
import { useShallow } from 'zustand/react/shallow'
import { WorkspacePlaylistsRequestResponse } from '@modules/playlist/api/requests/workspacePlaylistsRequest'
import { useRouterPlaylistFilter } from '@modules/playlist/hooks/useRouterPlaylistFilter'
import { useEffect } from 'react'

export const WorkspacePlaylistsPageList = ({ data, isLoading }: { data?: WorkspacePlaylistsRequestResponse, isLoading: boolean }) => {
    const setPlaylistCount = useSearchCountStore(useShallow(state => state.setPlaylistCount))

    const { filters } = useRouterPlaylistFilter()

    useEffect(() => {
        if(data?.meta) {
            setPlaylistCount(data.meta.total)
        }
    }, [data, setPlaylistCount])

    if (isLoading || !data) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    const { meta, data: playlists } = data

    const pageExists = filters.page <= meta.pages

    if(!pageExists) {
        return (
            <div>
                Page not found
            </div>
        )
    }

    if(playlists.length === 0) {
        return (
            <div>
                No playlists found
            </div>
        )
    }

    return (
        <div>
            <div className='flex flex-col gap-2'>
                {
                    playlists.map(
                        playlist => (
                            <WorkspacePlaylistsPlaylistCard
                                key={ playlist.id }
                                playlist={ playlist }
                            />
                        )
                    )
                }
            </div>
        </div>
    )
}