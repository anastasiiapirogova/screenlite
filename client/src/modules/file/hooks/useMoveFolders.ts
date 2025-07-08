import { useMutation, useQueryClient } from '@tanstack/react-query'
import { moveFoldersRequest, MoveFoldersRequestData } from '../api/moveFolders'
import { FolderWithChildrenCount } from '../types'

export function useMoveFolders({ onSuccessMove }: { onSuccessMove?: () => void } = {}) {
    const queryClient = useQueryClient()

    const moveFolders = useMutation({
        mutationFn: moveFoldersRequest,
        onMutate: async (variables: MoveFoldersRequestData & { sourceParentId?: string | null }) => {
            await queryClient.cancelQueries({ queryKey: ['workspaceFolders'] })

            const sourceQueryKey = ['workspaceFolders', { 
                id: variables.workspaceId, 
                filters: {
                    search: '',
                    deleted: false,
                    parentId: variables.sourceParentId || null
                }
            }]

            const targetQueryKey = ['workspaceFolders', { 
                id: variables.workspaceId, 
                filters: {
                    search: '',
                    deleted: false,
                    parentId: variables.targetFolderId || null
                } 
            }]
            
            const previousSourceData = queryClient.getQueryData(sourceQueryKey)
            const previousTargetData = queryClient.getQueryData(targetQueryKey)

            queryClient.setQueryData(sourceQueryKey, (oldData: FolderWithChildrenCount[] | undefined) => {
                if (!oldData) return oldData
                
                return oldData.filter(folder => !variables.folderIds.includes(folder.id))
            })

            queryClient.setQueryData(targetQueryKey, (oldData: FolderWithChildrenCount[] | undefined) => {
                if (!oldData) return oldData
                
                const sourceData = queryClient.getQueryData(sourceQueryKey) as FolderWithChildrenCount[] | undefined
                const foldersToMove = sourceData?.filter(folder => variables.folderIds.includes(folder.id)) || []
                
                const movedFolders = foldersToMove.map(folder => ({ ...folder, parentId: variables.targetFolderId }))
                
                return [...oldData, ...movedFolders]
            })

            const allFoldersQueries = queryClient.getQueriesData({
                queryKey: ['workspaceFolders', {
                    id: variables.workspaceId,
                    filters: {
                        search: '',
                        deleted: false
                    }
                }]
            })
            
            if (variables.sourceParentId !== null && variables.sourceParentId !== undefined) {
                for (const [queryKey, data] of allFoldersQueries) {
                    const foldersData = data as FolderWithChildrenCount[]

                    if (foldersData) {
                        const updatedFolders = foldersData.map(folder => {
                            if (folder.id === variables.sourceParentId) {
                                return {
                                    ...folder,
                                    _count: {
                                        ...folder._count,
                                        subfolders: Math.max(0, folder._count.subfolders - variables.folderIds.length)
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
                                        subfolders: folder._count.subfolders + variables.folderIds.length
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
            queryClient.invalidateQueries({ queryKey: ['workspaceFolders'] })
            if (onSuccessMove) onSuccessMove()
        }
    })

    return { moveFolders }
} 