import { ParentFolderTreeResult } from '../../types'
import { Button } from '@shared/ui/buttons/Button'
import { TbChevronRight } from 'react-icons/tb'
import { DroppableWrapper } from '@shared/components/DroppableWrapper'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'

interface FolderBreadcrumbsProps {
    folderData?: { folder: { name: string }, parentFolders: ParentFolderTreeResult[] }
}

const DroppableBreadcrumbButton = ({ folderId, children }: { folderId: string, children: React.ReactNode }) => {
    const routes = useWorkspaceRoutes()

    return (
        <DroppableWrapper
            id={ folderId }
            isOverClassName="bg-blue-50 border-blue-200"
        >
            <Button
                to={ folderId === 'root' ? routes.files : routes.folder(folderId) }
                color='secondary'
                variant="soft"
                size='small'
            >
                { children }
            </Button>
        </DroppableWrapper>
    )
}

export const FolderBreadcrumbs = ({ folderData }: FolderBreadcrumbsProps) => {
    // If no folder, we're on root page - just show Files
    if (!folderData) {
        return (
            <div className='flex items-center gap-2 text-sm text-gray-600'>
                <span className='font-medium text-gray-900'>Files</span>
            </div>
        )
    }

    const { folder: { name: currentFolderName }, parentFolders } = folderData

    // If no parent folders, show Files > Current
    if (parentFolders.length === 0) {
        return (
            <div className='flex items-center gap-2 text-sm text-gray-600'>
                <DroppableBreadcrumbButton folderId="root">
                    Files
                </DroppableBreadcrumbButton>
                <TbChevronRight size={ 16 } />
                <span className='font-medium text-gray-900'>{ currentFolderName }</span>
            </div>
        )
    }

    // If there's only one parent, show Files > Current
    if (parentFolders.length === 1) {
        return (
            <div className='flex items-center gap-2 text-sm text-gray-600'>
                <DroppableBreadcrumbButton folderId="root">
                    Files
                </DroppableBreadcrumbButton>
                <TbChevronRight size={ 16 } />
                <span className='font-medium text-gray-900'>{ currentFolderName }</span>
            </div>
        )
    }

    // If there are multiple parents, show Files > ... > Parent > Current
    const parent = parentFolders[parentFolders.length - 1]
    
    return (
        <div className='flex items-center gap-2 text-sm text-gray-600'>
            <DroppableBreadcrumbButton folderId="root">
                Files
            </DroppableBreadcrumbButton>
            <TbChevronRight size={ 16 } />
            <span className='text-gray-500'>...</span>
            <TbChevronRight size={ 16 } />
            <DroppableBreadcrumbButton folderId={ parent.id }>
                { parent.name }
            </DroppableBreadcrumbButton>
            <TbChevronRight size={ 16 } />
            <span className='font-medium text-gray-900'>{ currentFolderName }</span>
        </div>
    )
} 