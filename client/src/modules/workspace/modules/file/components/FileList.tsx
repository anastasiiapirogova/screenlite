import { useRouterSearch } from '@shared/hooks/useRouterSearch'
import { DraggableFileCard } from './FileCard'
import { useDebounce } from '@uidotdev/usehooks'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense } from 'react'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { workspaceFilesQuery } from '../api/workspaceFiles'

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

    return (
        <div>
            {
                files.map(
                    file => (
                        <DraggableFileCard
                            file={ file }
                            key={ file.id }
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
                    <SuspenseFileList search={ debouncedSearchTerm }/>
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}