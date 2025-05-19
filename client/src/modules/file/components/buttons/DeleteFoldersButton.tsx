import { ButtonElement } from '@/types'
import { deleteFoldersRequest, DeleteFoldersRequestData } from '@modules/file/api/requests/deleteFoldersRequest'
import { useMutation } from '@tanstack/react-query'
import { cloneElement } from 'react'

type Props = {
    children: ButtonElement
    folderIds: string[] | string
}

export const DeleteFoldersButton = ({ folderIds, children }: Props) => {
    const data: DeleteFoldersRequestData = {
        folderIds: Array.isArray(folderIds) ? folderIds : [folderIds]
    }
    
    const { mutate, isPending } = useMutation({
        mutationFn: (data: DeleteFoldersRequestData) => deleteFoldersRequest(data),
        onSuccess: async (folder) => {
            console.log(folder)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const Component = children

    return (
        cloneElement(Component, {
            onClick: () => mutate(data),
            disabled: isPending
        })
    )
}
