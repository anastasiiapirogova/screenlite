import { useRouterSearch } from '@shared/hooks/useRouterSearch'
import { useDebounce } from '@uidotdev/usehooks'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense, useState } from 'react'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { DraggableFolderCard } from './FolderCard'
import { workspaceFoldersQuery } from '../api/workspaceFolders'
import { useSelectionStore } from '@stores/useSelectionStore'
import { Folder } from '../types'

type FileListProps = {
	search: string
    parentId?: string
}

const SuspenseFolderList = ({ search, parentId }: FileListProps) => {
    const workspace = useWorkspace()
	
    const { data: folders } = useSuspenseQuery(workspaceFoldersQuery({
        id: workspace.id,
        filters: {
            search,
            deleted: false,
            parentId: parentId || null
        }
    }))

    const { isSelected, unselectItem, setSelectedItems } = useSelectionStore()
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null)

    const handleFolderClick = (folder: Folder, index: number, event: React.MouseEvent) => {
        const isCtrl = event.ctrlKey || event.metaKey
        const isShift = event.shiftKey
        const alreadySelected = isSelected(folder.id)

        if (isShift && lastSelectedIndex !== null) {
            const start = Math.min(lastSelectedIndex, index)
            const end = Math.max(lastSelectedIndex, index)

            const selectedItems = folders.slice(start, end + 1).map((folder) => ({
                [folder.id]: { item: folder, entity: 'folder' }
            }))

            setSelectedItems(Object.assign({}, ...selectedItems))
        } else if (isCtrl) {
            if (alreadySelected) {
                unselectItem(folder.id)
            } else {
                setSelectedItems({
                    [folder.id]: { item: folder, entity: 'folder' }
                })
            }
            setLastSelectedIndex(index)
        } else {
            if (!alreadySelected) {
                setSelectedItems({
                    [folder.id]: { item: folder, entity: 'folder' }
                })
            }
            setLastSelectedIndex(index)
        }
    }

    return (
        <div className='flex flex-wrap justify-between gap-5'>
            { folders.map((folder: Folder, idx: number) => (
                <DraggableFolderCard
                    folder={ folder }
                    key={ folder.id }
                    onClick={ (e: React.MouseEvent) => handleFolderClick(folder, idx, e) }
                />
            )) }
        </div>
    )
}

export const FolderList = ({ parentId }: { parentId?: string }) => {
    const { searchTerm } = useRouterSearch()
    const debouncedSearchTerm = useDebounce(searchTerm, 300)

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
                        search={ debouncedSearchTerm }
                        parentId={ parentId }
                    />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}