import { useMutation } from '@tanstack/react-query'
import { updatePlaylistRequest, UpdatePlaylistRequestData } from '../../api/requests/updatePlaylistRequest'
import { usePlaylist } from '../../hooks/usePlaylist'
import { TbPlayerPlayFilled } from 'react-icons/tb'
import { useSetPlaylistQueryData } from '../../hooks/useSetPlaylistQueryData'
import { Button } from '@shared/ui/buttons/Button'

export const SwitchPlaylistStatusButton = () => {
    const { id, isPublished, workspaceId } = usePlaylist()
    const setPlaylistQueryData = useSetPlaylistQueryData()

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: UpdatePlaylistRequestData) => {
            await new Promise(resolve => setTimeout(resolve, 500))

            return updatePlaylistRequest(data)
        },
        onSuccess: async (data) => {
            setPlaylistQueryData(id, data)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const switchStatus = () => mutate({
        workspaceId: workspaceId,
        playlistId: id,
        isPublished: !isPublished
    })

    return (
        <Button
            onClick={ switchStatus }
            disabled={ isPending }
            color='secondary'
            variant='soft'
            icon={ (!isPublished && !isPending) ? TbPlayerPlayFilled : undefined }
        >
            {
                isPending ? (
                    <span>{ isPublished ? 'Unpublishing...' : 'Publishing...' }</span>
                ) : isPublished ? (
                    <span>
                        Unpublish
                    </span>
                ) : (
                    <span>
                        Publish
                    </span>
                )
            }
        </Button>
    )
}
