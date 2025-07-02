import { ParentFolderTreeResult } from '../../types'
import { Button } from '@shared/ui/buttons/Button'
import { TbChevronRight } from 'react-icons/tb'
import { DroppableWrapper } from '@shared/components/DroppableWrapper'

interface FolderBreadcrumbsProps {
    folder?: {
        name: string
        parentFolders: ParentFolderTreeResult[]
    }
}

const DroppableBreadcrumbButton = ({ folderId, children }: { folderId: string, children: React.ReactNode }) => {
    return (
        <DroppableWrapper
            id={ folderId }
            isOverClassName="bg-blue-50 border-blue-200"
        >
            <Button
                to={ folderId === 'root' ? '/files' : `/files/folders/${folderId}` }
                color='secondary'
                variant="soft"
                size='small'
            >
                { children }
            </Button>
        </DroppableWrapper>
    )
}

export const FolderBreadcrumbs = ({ folder }: FolderBreadcrumbsProps) => {
    // If no folder, we're on root page - just show Files
    if (!folder) {
        return (
            <div className='flex items-center gap-2 text-sm text-gray-600'>
                <span className='font-medium text-gray-900'>Files</span>
            </div>
        )
    }

    const { name: currentFolderName, parentFolders } = folder

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