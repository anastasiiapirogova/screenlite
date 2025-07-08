import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense, useCallback } from 'react'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { DraggableFolderCard } from '../FolderCard'
import { workspaceFoldersQuery } from '../../api/workspaceFolders'
import { useSelectionStore } from '@stores/useSelectionStore'
import { FolderWithChildrenCount } from '../../types'
import { useContextMenuStore } from '@stores/useContextMenuStore'

type FolderListProps = {
	search?: string
    parentId?: string
    onFolderDoubleClick?: (folder: FolderWithChildrenCount) => void
}

const SuspenseFolderList = ({ search = '', parentId, onFolderDoubleClick }: FolderListProps) => {
    const workspace = useWorkspace()
    const { data: folders } = useSuspenseQuery(workspaceFoldersQuery({
        id: workspace.id,
        filters: {
            search,
            parentId: parentId || null
        }
    }))

    const { isSelected, setSelectedItems, handleItemClick } = useSelectionStore()
    const { openContextMenu } = useContextMenuStore()

    const handleFolderContextMenu = useCallback((folder: FolderWithChildrenCount, event: React.MouseEvent) => {
        event.preventDefault()
        const selected = isSelected(folder.id)

        if (!selected) {
            setSelectedItems({
                [folder.id]: { item: folder, entity: 'folder' }
            })
        }
        openContextMenu('folder', folder, event.clientX, event.clientY)
    }, [isSelected, setSelectedItems, openContextMenu])

    return (
        <div className='flex flex-wrap justify-between gap-5'>
            { folders.map((folder: FolderWithChildrenCount, idx: number) => (
                <DraggableFolderCard
                    folder={ folder }
                    key={ folder.id }
                    onClick={ (e: React.MouseEvent) => handleItemClick(folder, idx, e, folders, 'folder') }
                    onContextMenu={ (e: React.MouseEvent) => handleFolderContextMenu(folder, e) }
                    onDoubleClick={ onFolderDoubleClick ? () => onFolderDoubleClick(folder) : undefined }
                />
            )) }
        </div>
    )
}

export const FolderList = ({ parentId, onFolderDoubleClick }: { parentId?: string, onFolderDoubleClick?: (folder: FolderWithChildrenCount) => void }) => {
    return (
        <QueryErrorResetBoundary>
            <ErrorBoundary fallbackRender={ () => (
                <div>
                    There was an error!
                </div>
            ) }
            >
                <Suspense fallback={ <>Loading</> }>
                    <SuspenseFolderList
                        parentId={ parentId }
                        onFolderDoubleClick={ onFolderDoubleClick }
                    />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}