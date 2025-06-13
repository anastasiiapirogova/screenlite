import { useRouterSearch } from '@shared/hooks/useRouterSearch'
import { useDebounce } from '@uidotdev/usehooks'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense } from 'react'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { DraggableFolderCard } from './FolderCard'
import { workspaceFoldersQuery } from '../api/workspaceFolders'

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

    return (
        <div className='flex flex-wrap gap-5'>
            { folders.map(folder => (
                <DraggableFolderCard
                    folder={ folder }
                    key={ folder.id }
                />
            )) }
        </div>
    )
}

export const Folders = ({ parentId }: { parentId?: string }) => {
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