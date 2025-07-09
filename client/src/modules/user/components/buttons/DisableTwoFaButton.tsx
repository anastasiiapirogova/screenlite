import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cloneElement } from 'react'
import { ButtonElement } from '@/types'
import { useConfirmationDialogStore } from '@stores/useConfirmationDialogStore'
import { disableTwoFaRequest } from '@modules/user/api/requests/disableTwoFaRequest'
import { currentUserQuery } from '@modules/auth/api/currentUser'
import { handleAxiosFieldErrors } from '@shared/helpers/handleAxiosFieldErrors'

type Props = {
	children: ButtonElement
}

export const DisableTwoFaButton = ({ children }: Props) => {
    const confirm = useConfirmationDialogStore((state) => state.confirm)
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: () => disableTwoFaRequest(),
        onSuccess: async (screen) => {
            queryClient.setQueryData(currentUserQuery().queryKey, screen)
        },
        onError: (error) => {
            handleAxiosFieldErrors(error, console.log)
        }
    })

    const handleClick = async () => {
        const confirmed = await confirm({
            title: 'Disable two-factor authentication',
            message: 'Are you sure you want to disable two-factor authentication?\n\nThis will remove the extra layer of security from your account.',
            confirmText: 'Disable',
            cancelText: 'Cancel',
            variant: 'danger'
        })

        if (confirmed) {
            mutate()
        }
    }

    const Component = children

    return cloneElement(Component, {
        onClick: handleClick,
        disabled: isPending,
    })
}
