import { useRouterSearch } from '@shared/hooks/useRouterSearch'
import { DraggableFileCard } from './FileCard'
import { useDebounce } from '@uidotdev/usehooks'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense, useState } from 'react'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { workspaceFilesQuery } from '../api/workspaceFiles'
import { useSelectionStore } from '@stores/useSelectionStore'
import { WorkspaceFile } from '../types'

interface FileListProps {
	search: string
}

const SuspenseFileList = ({ search }: FileListProps) => {
    const workspace = useWorkspace()
    const { data } = useSuspenseQuery(workspaceFilesQuery({
        id: workspace.id,
        filters: {
            search,
            deleted: false,
            folderId: null
        }
    }))

    const { data: files } = data
    const { isSelected, selectItem, unselectItem, setSelectedItems } = useSelectionStore()
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null)

    const handleFileClick = (file: WorkspaceFile, index: number, event: React.MouseEvent) => {
        const isCtrl = event.ctrlKey || event.metaKey
        const isShift = event.shiftKey
        const alreadySelected = isSelected(file.id)

        if (isShift && lastSelectedIndex !== null) {
            const start = Math.min(lastSelectedIndex, index)
            const end = Math.max(lastSelectedIndex, index)

            const selectedItems = files.slice(start, end + 1).map((file) => ({
                [file.id]: { item: file, entity: 'file' }
            }))

            setSelectedItems(Object.assign({}, ...selectedItems))
        } else if (isCtrl) {
            if (alreadySelected) {
                unselectItem(file.id)
            } else {
                selectItem({ item: file, entity: 'file' })
            }
            setLastSelectedIndex(index)
        } else {
            setSelectedItems({
                [file.id]: { item: file, entity: 'file' }
            })
            setLastSelectedIndex(index)
        }
    }

    return (
        <div>
            {
                files.map(
                    (file: WorkspaceFile, idx: number) => (
                        <DraggableFileCard
                            file={ file }
                            key={ file.id }
                            onClick={ (e: React.MouseEvent) => handleFileClick(file, idx, e) }
                        />
                    )
                )
            }
        </div>
    )
}

export const FileList = () => {
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
                    <SuspenseFileList search={ debouncedSearchTerm } />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}