import { ButtonElement } from '@/types'
import { createFolderRequest, CreateFolderRequestData } from '@workspaceModules/file/api/createFolder'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cloneElement } from 'react'

type Props = {
    children: ButtonElement
    parentId: string | null
}

export const CreateFolderButton = ({ children, parentId }: Props) => {
    const { id } = useWorkspace()
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: (data: CreateFolderRequestData) => createFolderRequest(data),
        onSuccess: async () => {
            queryClient.invalidateQueries({
                queryKey: ['workspaceFolders', { id, filters: { parentId } }],
            })
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const data: CreateFolderRequestData = {
        name: 'New folder',
        parentId,
        workspaceId: id
    }

    const Component = children

    return (
        cloneElement(Component, {
            onClick: () => mutate(data),
            disabled: isPending
        })
    )
}
