import { Resolution } from '@/types'
import { PlaylistLayoutEditorLayoutSection } from '../types'
import { PlaylistLayoutPreview } from '@modules/playlistLayout/components/PlaylistLayoutPreview'

type Props = {
    sections: PlaylistLayoutEditorLayoutSection[] | null
    resolution: Resolution | null
}

export const PlaylistLayoutEditorPreview = ({ sections, resolution }: Props) => {
    if(!sections || !resolution) {
        return null
    }
    
    const playlistLayoutPreviewData = {
        sections: sections,
        resolutionHeight: resolution.height,
        resolutionWidth: resolution.width,
    }

    return (
        <div className='aspect-video w-full'>
            <PlaylistLayoutPreview playlistLayout={ playlistLayoutPreviewData }/>
        </div>
    )
}