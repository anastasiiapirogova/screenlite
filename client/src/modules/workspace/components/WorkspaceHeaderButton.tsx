import { WorkspacePicture } from '@shared/components/WorkspacePicture'
import { useWorkspace } from '../hooks/useWorkspace'

export const WorkspaceHeaderButton = () => {
    const workspace = useWorkspace(true)

    if(!workspace) return null

    return (
        <div className="flex items-center h-14">
            <div className='flex gap-4 items-center cursor-default'>
                <WorkspacePicture
                    name={ workspace.name }
                    picture={ workspace.picture }
                    size={ 40 }
                />
                <div className=''>
                    { workspace.name }
                </div>
            </div>
        </div>
    )
}