import { ParentFolderTreeResult } from '../../types'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { Button } from '@shared/ui/buttons/Button'
import { TbChevronRight } from 'react-icons/tb'

interface FolderBreadcrumbsProps {
    folder?: {
        name: string
        parentFolders: ParentFolderTreeResult[]
    }
}

export const FolderBreadcrumbs = ({ folder }: FolderBreadcrumbsProps) => {
    const routes = useWorkspaceRoutes()

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
                <Button
                    to={ routes.files }
                    color='secondary'
                    variant="soft"
                    size='small'
                >
                    Files
                </Button>
                <TbChevronRight size={ 16 } />
                <span className='font-medium text-gray-900'>{ currentFolderName }</span>
            </div>
        )
    }

    // If there's only one parent, show Files > Current
    if (parentFolders.length === 1) {
        return (
            <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Button
                    to={ routes.files }
                    color='secondary'
                    variant="soft"
                    size='small'
                >
                    Files
                </Button>
                <TbChevronRight size={ 16 } />
                <span className='font-medium text-gray-900'>{ currentFolderName }</span>
            </div>
        )
    }

    // If there are multiple parents, show Files > ... > Parent > Current
    const parent = parentFolders[parentFolders.length - 1]
    
    return (
        <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Button
                to={ routes.files }
                color='secondary'
                variant="soft"
                size='small'
            >
                Files
            </Button>
            <TbChevronRight size={ 16 } />
            <span className='text-gray-500'>...</span>
            <TbChevronRight size={ 16 } />
            <Button
                to={ routes.folder(parent.id) }
                color='secondary'
                variant="soft"
                size='small'
            >
                { parent.name }
            </Button>
            <TbChevronRight size={ 16 } />
            <span className='font-medium text-gray-900'>{ currentFolderName }</span>
        </div>
    )
} 