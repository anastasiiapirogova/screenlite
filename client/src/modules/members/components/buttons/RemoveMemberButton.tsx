import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cloneElement } from 'react'
import { Member } from '../../types'
import { ButtonElement } from '@/types'
import { useConfirmationDialogStore } from '@stores/useConfirmationDialogStore'
import { removeMemberRequest, RemoveMemberRequestData } from '@modules/members/api/requests/removeMemberRequest'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'

type Props = {
	children: ButtonElement
    member: Member
}

export const RemoveMemberButton = ({ children, member }: Props) => {
    const confirm = useConfirmationDialogStore((state) => state.confirm)
    const queryClient = useQueryClient()
    const workspace = useWorkspace()
    const refetchQueries = () => {
        queryClient.refetchQueries({ queryKey: [
            'workspaceMembersQuery',
            {
                workspaceId: workspace.id,
            }
        ] })
    }

    const { mutate, isPending } = useMutation({
        mutationFn: (data: RemoveMemberRequestData) => removeMemberRequest(data),
        onSuccess: async () => {
            refetchQueries()
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const handleClick = async () => {
        const confirmed = await confirm({
            title: 'Remove member',
            message: `Are you sure you want to remove "${member.user.name}" from the workspace?`,
            confirmText: 'Remove',
            cancelText: 'Cancel',
            variant: 'warning'
        })

        if (confirmed) {
            mutate({
                userId: member.userId,
                workspaceId: workspace.id
            })
        }
    }

    const Component = children

    return cloneElement(Component, {
        onClick: handleClick,
        disabled: isPending,
    })
}
