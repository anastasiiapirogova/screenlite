import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cloneElement } from 'react'
import { RestorePlaylistsRequestData } from '../../types'
import { usePlaylist } from '../../hooks/usePlaylist'
import { ButtonElement } from '@/types'
import { restorePlaylistsRequest } from '../../api/requests/recoverPlaylistsRequest'
import { playlistQuery } from '@modules/playlist/api/queries/playlistQuery'

type Props = {
	children: ButtonElement
}

export const RestorePlaylistButton = ({ children }: Props) => {
    const playlist = usePlaylist()
    const queryClient = useQueryClient()
    const playlistQueryKey = playlistQuery({
        playlistId: playlist.id,
        workspaceId: playlist.workspaceId
    }).queryKey

    const { mutate, isPending } = useMutation({
        mutationFn: (data: RestorePlaylistsRequestData) => restorePlaylistsRequest(data),
        onSuccess: async () => {
            queryClient.refetchQueries({ queryKey: playlistQueryKey })
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const handleClick = async () => {
        mutate({
            playlistIds: [playlist.id],
            workspaceId: playlist.workspaceId
        })
    }

    const Component = children

    if (!playlist.deletedAt) return null

    return cloneElement(Component, {
        onClick: handleClick,
        disabled: isPending,
    })
}
