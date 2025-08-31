import { useMutation } from '@tanstack/react-query'
import { ButtonHTMLAttributes, cloneElement, ReactElement } from 'react'
import { useNavigate } from 'react-router'
import { useWorkspaceRoutes } from '@/modules/workspace/hooks/useWorkspaceRoutes'
import { useScreen } from '../hooks/useScreen'
import { deleteScreensRequest } from '../api/requests/deleteScreensRequest'
import { DeleteScreensRequestData } from '../types'
import { useRefetchWorkspaceStatistics } from '@modules/workspace/hooks/useRefetchWorkspaceStatistics'
import { useConfirmationDialogStore } from '@stores/useConfirmationDialogStore'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'

type Props = {
	children: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>, 'button'>
}

export const DeleteScreenButton = ({ children }: Props) => {
    const confirm = useConfirmationDialogStore((state) => state.confirm)
    const workspace = useWorkspace()
    const screen = useScreen()
    const navigate = useNavigate()
    const routes = useWorkspaceRoutes()
    const refetchStatistics = useRefetchWorkspaceStatistics()

    const { mutate, isPending } = useMutation({
        mutationFn: (data: DeleteScreensRequestData) => deleteScreensRequest(data),
        onSuccess: async () => {
            refetchStatistics()
            navigate(routes.screens)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const handleClick = async () => {
        const confirmed = await confirm({
            title: 'Delete screen',
            message: `Are you sure you want to delete "${screen.name}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger'
        })

        if (confirmed) {
            mutate({ screenIds: [screen.id], workspaceId: workspace.id })
        }
    }

    const Component = children

    return cloneElement(Component, {
        onClick: handleClick,
        disabled: isPending
    })
}
