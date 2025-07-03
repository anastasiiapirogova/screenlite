import { useMutation } from '@tanstack/react-query'
import { usePlaylist } from '../../hooks/usePlaylist.js'
import { copyPlaylistRequest, CopyPlaylistRequestData } from '../../api/requests/copyPlaylistRequest.js'
import { useSetPlaylistQueryData } from '../../hooks/useSetPlaylistQueryData.js'
import { cloneElement, ReactElement, useEffect, useState } from 'react'
import { CustomButtonProps } from '@shared/ui/buttons/Button.js'

type Props = {
	children: ReactElement<CustomButtonProps>
}

type Status = 'idle' | 'pending' | 'success'

export const CopyPlaylistButton = ({ children }: Props) => {
    const playlist = usePlaylist()
    const setPlaylistQueryData = useSetPlaylistQueryData()
    const [status, setStatus] = useState<Status>('idle')

    const { mutate, isPending } = useMutation({
        mutationFn: (data: CopyPlaylistRequestData) => copyPlaylistRequest(data),
        onMutate: () => setStatus('pending'),
        onSuccess: async (data) => {
            setPlaylistQueryData(data.id, data)
            setStatus('success')
        },
        onError: (error) => {
            console.log(error)
            setStatus('idle')
        }
    })

    useEffect(() => {
        if (status === 'success') {
            const timeout = setTimeout(() => setStatus('idle'), 2000)

            return () => clearTimeout(timeout)
        }
    }, [status])

    const copyPlaylist = () => mutate({
        playlistId: playlist.id,
        workspaceId: playlist.workspaceId
    })

    const buttonStatus: Status = status === 'success' ? 'success' : (isPending ? 'pending' : 'idle')

    return cloneElement(children, {
        onClick: () => copyPlaylist(),
        disabled: isPending || status === 'success',
        status: buttonStatus,
        statusText: {
            success: 'Copied',
            pending: 'Copying...',
            idle: 'Copy'
        }
    })
}
