import { useWorkspace } from '../hooks/useWorkspace'

export const WorkspacePage = () => {
    const workspace = useWorkspace()

    return (
        <div>
            { workspace?.name }
        </div>
    )
}
