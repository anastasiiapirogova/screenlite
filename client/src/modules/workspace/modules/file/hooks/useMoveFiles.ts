import { useMutation, useQueryClient } from '@tanstack/react-query'
import { moveFilesRequest, MoveFilesRequestData } from '../api/moveFiles'
import { WorkspaceFile, FolderWithChildrenCount } from '../types'

type FilesQueryData = {
    data: WorkspaceFile[]
    [key: string]: unknown
}

export function useMoveFiles({ onSuccessMove }: { onSuccessMove?: () => void } = {}) {
    const queryClient = useQueryClient()

    const moveFiles = useMutation({
        mutationFn: moveFilesRequest,
        onMutate: async (variables: MoveFilesRequestData & { sourceFolderId?: string | null }) => {
            await queryClient.cancelQueries({ queryKey: ['workspaceFiles'] })
            await queryClient.cancelQueries({ queryKey: ['workspaceFolders'] })

            const sourceQueryKey = ['workspaceFiles', { 
                id: variables.workspaceId, 
                filters: {
                    search: '',
                    deleted: false,
                    folderId: variables.sourceFolderId || null
                }
            }]
            const targetQueryKey = ['workspaceFiles', { 
                id: variables.workspaceId, 
                filters: { 
                    search: '',
                    deleted: false,
                    folderId: variables.targetFolderId || null  
                } 
            }]
            
            const previousSourceData = queryClient.getQueryData(sourceQueryKey)
            const previousTargetData = queryClient.getQueryData(targetQueryKey)

            queryClient.setQueryData(sourceQueryKey, (oldData: FilesQueryData | undefined) => {
                if (!oldData?.data) return oldData
                
                const updatedFiles = oldData.data.filter(file => !variables.fileIds.includes(file.id))
                
                return {
                    ...oldData,
                    data: updatedFiles
                }
            })

            queryClient.setQueryData(targetQueryKey, (oldData: FilesQueryData | undefined) => {
                if (!oldData?.data) return oldData
                
                const sourceData = queryClient.getQueryData(sourceQueryKey) as FilesQueryData | undefined
                const filesToMove = sourceData?.data?.filter(file => variables.fileIds.includes(file.id)) || []
                
                const movedFiles = filesToMove.map(file => ({ ...file, folderId: variables.targetFolderId }))
                
                return {
                    ...oldData,
                    data: [...oldData.data, ...movedFiles]
                }
            })

            const allFoldersQueries = queryClient.getQueriesData({ queryKey: ['workspaceFolders'] })
            
            if (variables.sourceFolderId !== null && variables.sourceFolderId !== undefined) {
                for (const [queryKey, data] of allFoldersQueries) {
                    const foldersData = data as FolderWithChildrenCount[]

                    if (foldersData) {
                        const updatedFolders = foldersData.map(folder => {
                            if (folder.id === variables.sourceFolderId) {
                                return {
                                    ...folder,
                                    _count: {
                                        ...folder._count,
                                        files: Math.max(0, folder._count.files - variables.fileIds.length)
                                    }
                                }
                            }
                            return folder
                        })

                        queryClient.setQueryData(queryKey, updatedFolders)
                    }
                }
            }

            if (variables.targetFolderId !== null && variables.targetFolderId !== undefined) {
                for (const [queryKey, data] of allFoldersQueries) {
                    const foldersData = data as FolderWithChildrenCount[]

                    if (foldersData) {
                        const updatedFolders = foldersData.map(folder => {
                            if (folder.id === variables.targetFolderId) {
                                return {
                                    ...folder,
                                    _count: {
                                        ...folder._count,
                                        files: folder._count.files + variables.fileIds.length
                                    }
                                }
                            }
                            return folder
                        })

                        queryClient.setQueryData(queryKey, updatedFolders)
                    }
                }
            }

            return { previousSourceData, previousTargetData, sourceQueryKey, targetQueryKey, allFoldersQueries }
        },
        onError: (_err, _variables, context) => {
            if (context?.previousSourceData) {
                queryClient.setQueryData(context.sourceQueryKey, context.previousSourceData)
            }
            if (context?.previousTargetData) {
                queryClient.setQueryData(context.targetQueryKey, context.previousTargetData)
            }
            if (context?.allFoldersQueries) {
                context.allFoldersQueries.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data)
                })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaceFiles'] })
            queryClient.invalidateQueries({ queryKey: ['workspaceFolders'] })
            if (onSuccessMove) onSuccessMove()
        }
    })

    return { moveFiles }
} 