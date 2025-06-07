import { useMutation } from '@tanstack/react-query'
import { cloneElement } from 'react'
import { DeletePlaylistsRequestData } from '../../types'
import { deletePlaylistsRequest } from '../../api/requests/deletePlaylistsRequest'
import { useNavigate } from 'react-router'
import { useWorkspaceRoutes } from '@/modules/workspace/hooks/useWorkspaceRoutes'
import { usePlaylist } from '../../hooks/usePlaylist'
import { ButtonElement } from '@/types'
import { useConfirmationDialogStore } from '@stores/useConfirmationDialogStore'

type Props = {
	children: ButtonElement
}

export const DeletePlaylistButton = ({ children }: Props) => {
    const confirm = useConfirmationDialogStore((state) => state.confirm)
    const playlist = usePlaylist()
    const navigate = useNavigate()
    const routes = useWorkspaceRoutes()

    const { mutate, isPending } = useMutation({
        mutationFn: (data: DeletePlaylistsRequestData) => deletePlaylistsRequest(data),
        onSuccess: async () => {
            navigate(routes.playlists)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const handleClick = async () => {
        const confirmed = await confirm({
            title: 'Delete playlist',
            message: `Are you sure you want to delete "${playlist.name}"?\n\nThe playlist will be moved to the trash and can be restored later.\n\nPlayback of this playlist will stop on all screens.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'warning'
        })

        if (confirmed) {
            mutate({ playlistIds: [playlist.id] })
        }
    }

    const Component = children

    if (playlist.deletedAt) return null

    return cloneElement(Component, {
        onClick: handleClick,
        disabled: isPending,
    })
}
