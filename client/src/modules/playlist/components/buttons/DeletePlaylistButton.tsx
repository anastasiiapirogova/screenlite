import { useMutation } from '@tanstack/react-query'
import { cloneElement } from 'react'
import { DeletePlaylistsRequestData } from '../../types'
import { deletePlaylistsRequest } from '../../api/requests/deletePlaylistsRequest'
import { useNavigate } from 'react-router'
import { useWorkspaceRoutes } from '@/modules/workspace/hooks/useWorkspaceRoutes'
import { usePlaylist } from '../../hooks/usePlaylist'
import { ButtonElement } from '@/types'

type Props = {
	children: ButtonElement
}

export const DeletePlaylistButton = ({ children }: Props) => {
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

    const deletePlaylist = () => mutate({
        playlistIds: [playlist.id]
    })

    const Component = children

    if(playlist.deletedAt) return null

    return cloneElement(Component, {
        onClick: () => deletePlaylist(),
        disabled: isPending,
    })
}
