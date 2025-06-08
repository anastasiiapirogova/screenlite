import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { Folder } from '../types'
import { useNavigate } from 'react-router'

export const FolderCard = ({ folder }: { folder: Folder }) => {
    const routes = useWorkspaceRoutes()

    const navigate = useNavigate()

    const handleDoubleClick = () => {
        navigate(routes.folder(folder.id))
    }

    return (
        <div
            onDoubleClick={ handleDoubleClick }
            className='flex flex-col gap-2 p-5 border rounded-2xl hover:bg-gray-50 transition-all aspect-square w-[150px] select-none'
        >
            { folder.name }
        </div>
    )
}