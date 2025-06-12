import { PlaylistLayoutSectionsList } from '../components/PlaylistLayoutSectionsList'
import { WorkspacePlaylistLayoutEditorLayout } from '../layouts/WorkspacePlaylistLayoutEditorLayout'
import { usePlaylistLayoutEditorStorage } from '@stores/usePlaylistLayoutEditorStorage'
import { PlaylistLayoutEditorDndContext } from '../components/PlaylistLayoutEditorDndContext'
import { PlaylistLayoutEditorPreview } from '../components/PlaylistLayoutEditorPreview'

export const WorkspacePlaylistLayoutEditorPage = () => {
    const { sections, resolution } = usePlaylistLayoutEditorStorage()
    
    return (
        <WorkspacePlaylistLayoutEditorLayout>
            <div className='grid grid-cols-2 gap-5'>
                <div>
                    <PlaylistLayoutEditorPreview
                        sections={ sections }
                        resolution={ resolution }
                    />
                </div>
                <div>
                    <PlaylistLayoutEditorDndContext>
                        <PlaylistLayoutSectionsList />
                    </PlaylistLayoutEditorDndContext>
                </div>
            </div>
        </WorkspacePlaylistLayoutEditorLayout>
    )
}
