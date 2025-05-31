import { WorkspacePicture } from '@shared/components/WorkspacePicture'
import { useWorkspace } from '../hooks/useWorkspace'

export const WorkspaceHeaderButton = () => {
    const workspace = useWorkspace(true)

    if (!workspace) {
        return (
            <div className="flex items-center h-14">
                <div className="flex gap-4 items-center cursor-default">
                    <div className="w-10 h-10 rounded-lg bg-slate-300 animate-pulse" />
                    <div className="w-24 h-5 bg-slate-300 rounded animate-pulse" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center h-14">
            <div className='flex gap-4 items-center cursor-default'>
                <WorkspacePicture
                    name={ workspace.name }
                    picture={ workspace.picture }
                    size={ 40 }
                />
                <div>
                    { workspace.name }
                </div>
            </div>
        </div>
    )
}