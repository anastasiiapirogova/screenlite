import { ParentFolderTreeResult } from '../types'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { Button } from '@shared/ui/buttons/Button'
import { TbChevronRight } from 'react-icons/tb'

interface FolderBreadcrumbsProps {
    parentFolders: ParentFolderTreeResult[]
    currentFolderName: string
}

export const FolderBreadcrumbs = ({ parentFolders, currentFolderName }: FolderBreadcrumbsProps) => {
    const routes = useWorkspaceRoutes()

    // If no parent folders, just show Home > Current
    if (parentFolders.length === 0) {
        return (
            <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Button
                    to={ routes.files }
                    color='secondary'
                    variant="soft"
                    size='small'
                >
                    Home
                </Button>
                <TbChevronRight size={ 16 } />
                <span className='font-medium text-gray-900'>{ currentFolderName }</span>
            </div>
        )
    }

    // If there's only one parent, show Home > Parent > Current
    if (parentFolders.length === 1) {
        const parent = parentFolders[0]

        return (
            <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Button
                    to={ routes.files }
                    color='secondary'
                    variant="soft"
                    size='small'
                >
                    Home
                </Button>
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

    // If there are multiple parents, show Home > ... > Parent > Current
    const parent = parentFolders[parentFolders.length - 1] // Last parent (immediate parent)
    
    return (
        <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Button
                to={ routes.files }
                color='secondary'
                variant="soft"
                size='small'
            >
                Home
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