import { playlistItemsQuery } from '@modules/workspace/modules/playlist/api/queries/playlistItemsQuery'
import { updatePlaylistItemsRequest, UpdatePlaylistItemsRequestData } from '@modules/workspace/modules/playlist/api/requests/updatePlaylistItemsRequest'
import { usePlaylist } from '@modules/workspace/modules/playlist/hooks/usePlaylist'
import { PlaylistItem } from '@modules/workspace/modules/playlist/types'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { Button } from '@shared/ui/buttons/Button'
import { usePlaylistContentManagerStorage } from '@stores/usePlaylistContentManagerStorage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TbChevronLeft } from 'react-icons/tb'
import { useNavigate } from 'react-router'

export const PlaylistContentManagerHeader = () => {
    const queryClient = useQueryClient()
    const { items, clearState, isModified, setItems } = usePlaylistContentManagerStorage()
    const routes = useWorkspaceRoutes()
    const playlist = usePlaylist()
    const navigate = useNavigate()
    const queryKey = playlistItemsQuery(playlist.id).queryKey

    const closeContentManager = async () => {
        await navigate(routes.playlist(playlist.id), { replace: true })
        
        setTimeout(() => {
            if (isModified) {
                queryClient.invalidateQueries({ queryKey: playlistItemsQuery(playlist.id).queryKey })
            }

            clearState()
        }, 200)
    }

    const revertChanges = () => {
        const data = queryClient.getQueryData(queryKey) as PlaylistItem[]

        setItems(data)
    }

    const { mutate } = useMutation({
        mutationFn: (data: UpdatePlaylistItemsRequestData) => updatePlaylistItemsRequest(data),
        onMutate: async (data) => {
            const items = data.items

            await queryClient.cancelQueries({ queryKey })
        
            const previousItems = queryClient.getQueryData(queryKey)
        
            queryClient.setQueryData(queryKey, () => items)
        
            return { previousItems }
        },
        onError: (_err, _data, context) => {
            if (context) {
                queryClient.setQueryData(queryKey, context.previousItems)
            }
        },
    })

    const handleSave = () => {
        if (!items) return

        mutate({
            playlistId: playlist.id,
            items: items,
        })
    }
    
    return (
        <header className='flex justify-between items-center sticky top-0 h-[64px] border-b px-5 z-10 bg-white'>
            <Button
                onClick={ () => closeContentManager() }
                icon={ TbChevronLeft }
                variant='soft'
                color='secondary'
            >
                Back to playlist
            </Button>
            <div>
                <h1 className='text-xl font-semibold'>
                    {
                        playlist.name
                    }
                </h1>
            </div>
            <div className='flex gap-2'>
                { isModified ? (
                    <>
                        <Button
                            onClick={ revertChanges }
                            variant='soft'
                            color='secondary'
                        >
                            Revert changes
                        </Button>
                        <Button onClick={ handleSave }>
                            Save
                        </Button>
                    </> 
                ) : (
                    <div className='text-neutral-400 select-none'>
                        All changes saved
                    </div>
                ) }
            </div>
        </header>
    )
}
