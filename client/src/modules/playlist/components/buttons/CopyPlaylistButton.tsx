import { useMutation } from '@tanstack/react-query'
import { usePlaylist } from '../../hooks/usePlaylist.js'
import { copyPlaylistRequest, CopyPlaylistRequestData } from '../../api/requests/copyPlaylistRequest.js'
import { useSetPlaylistQueryData } from '../../hooks/useSetPlaylistQueryData.js'
import { ButtonElement } from '@/types.js'
import { cloneElement } from 'react'

type Props = {
	children: ButtonElement
}

export const CopyPlaylistButton = ({ children }: Props) => {
    const playlist = usePlaylist()
    const setPlaylistQueryData = useSetPlaylistQueryData()

    const { mutate, isPending } = useMutation({
        mutationFn: (data: CopyPlaylistRequestData) => copyPlaylistRequest(data),
        onSuccess: async (data) => {
            setPlaylistQueryData(data.id, data)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const copyPlaylist = () => mutate({
        playlistId: playlist.id
    })

    const Component = children

    return cloneElement(Component, {
        onClick: () => copyPlaylist(),
        disabled: isPending
    })
}
