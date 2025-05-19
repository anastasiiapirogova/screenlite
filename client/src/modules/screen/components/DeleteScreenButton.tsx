import { useMutation } from '@tanstack/react-query'
import { ButtonHTMLAttributes, cloneElement, ReactElement } from 'react'
import { useNavigate } from 'react-router'
import { useWorkspaceRoutes } from '@/modules/workspace/hooks/useWorkspaceRoutes'
import { useScreen } from '../hooks/useScreen'
import { deleteScreensRequest } from '../api/requests/deleteScreensRequest'
import { DeleteScreensRequestData } from '../types'
import { useRefetchWorkspaceEntityCounts } from '@modules/workspace/hooks/useRefetchWorkspaceEntityCounts'

type Props = {
	children: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>, 'button'>
}

export const DeleteScreenButton = ({ children }: Props) => {
    const screen = useScreen()
    const navigate = useNavigate()
    const routes = useWorkspaceRoutes()
    const refetchEntityCounts = useRefetchWorkspaceEntityCounts()

    const { mutate, isPending } = useMutation({
        mutationFn: (data: DeleteScreensRequestData) => deleteScreensRequest(data),
        onSuccess: async () => {
            refetchEntityCounts()
            navigate(routes.screens)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const deleteScreen = () => mutate({
        screenIds: [screen.id]
    })

    const Component = children

    return cloneElement(Component, {
        onClick: () => deleteScreen(),
        disabled: isPending
    })
}
