import { useMutation } from '@tanstack/react-query'
import { ButtonHTMLAttributes, cloneElement, ReactElement } from 'react'
import { useNavigate } from 'react-router'
import { useWorkspaceRoutes } from '@/modules/workspace/hooks/useWorkspaceRoutes'
import { usePlaylistLayout } from '../hooks/usePlaylistLayout'
import { deletePlaylistLayoutRequest, DeletePlaylistLayoutRequestData } from '../api/deletePlaylistLayout'
import { useRefetchWorkspaceEntityCounts } from '@modules/workspace/hooks/useRefetchWorkspaceEntityCounts'

type Props = {
    children: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>, 'button'>
}

export const DeletePlaylistLayoutButton = ({ children }: Props) => {
    const layout = usePlaylistLayout()
    const navigate = useNavigate()
    const routes = useWorkspaceRoutes()
    const refetchEntityCounts = useRefetchWorkspaceEntityCounts()

    const { mutate, isPending } = useMutation({
        mutationFn: (data: DeletePlaylistLayoutRequestData) => deletePlaylistLayoutRequest(data),
        onSuccess: async () => {
            navigate(routes.playlistLayouts)
            refetchEntityCounts()
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const deleteLayout = () => mutate({
        playlistLayoutId: layout.id,
        workspaceId: layout.workspaceId
    })

    return cloneElement(children, {
        onClick: () => deleteLayout(),
        disabled: isPending
    })
}
