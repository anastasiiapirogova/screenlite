import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { Folder } from '../types'
import { Link } from 'react-router'

export const FolderCard = ({ folder }: { folder: Folder }) => {
    const routes = useWorkspaceRoutes()

    return (
        <Link
            to={ routes.folder(folder.id) }
            className='flex flex-col gap-2 p-5 border rounded-2xl hover:bg-gray-50 transition-all'
        >
            { folder.name }
        </Link>
    )
}