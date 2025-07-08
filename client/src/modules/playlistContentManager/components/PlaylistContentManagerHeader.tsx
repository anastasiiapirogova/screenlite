import { updatePlaylistItemsRequest, UpdatePlaylistItemsRequestData } from '@modules/playlist/api/requests/updatePlaylistItemsRequest'
import { usePlaylist } from '@modules/playlist/hooks/usePlaylist'
import { PlaylistItem } from '@modules/playlist/types'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { Button } from '@shared/ui/buttons/Button'
import { usePlaylistContentManagerStorage } from '@stores/usePlaylistContentManagerStorage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TbChevronLeft } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { playlistItemsQuery } from '@modules/playlist/api/requests/playlistItemsRequest'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'

export const PlaylistContentManagerHeader = () => {
    const queryClient = useQueryClient()
    const workspace = useWorkspace()
    const { items, clearState, isModified, setItems } = usePlaylistContentManagerStorage()
    const routes = useWorkspaceRoutes()
    const playlist = usePlaylist()
    const navigate = useNavigate()
    const queryKey = playlistItemsQuery({ playlistId: playlist.id, workspaceId: workspace.id }).queryKey

    const closeContentManager = async () => {
        await navigate(routes.playlist(playlist.id), { replace: true })
        
        setTimeout(() => {
            if (isModified) {
                queryClient.invalidateQueries({ queryKey: queryKey })
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
            workspaceId: workspace.id,
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
