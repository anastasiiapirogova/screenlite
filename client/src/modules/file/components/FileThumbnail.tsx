import { WorkspaceFile } from '../types'
import { getFileThumbnailSrc } from '../utils/getFileThumbnailSrc'

const Thumbnail = ({ path, alt }: { path: string, alt: string }) => {
    return (
        <img
            src={ getFileThumbnailSrc(path) }
            alt={ alt }
            draggable={ false }
            className='rounded-md'
        />
    )
}

export const FileThumbnail = ({ file }: { file: WorkspaceFile }) => {
    if(file.previewPath) {
        return (
            <Thumbnail
                path={ file.previewPath }
                alt={ file.name }
            />
        )
    }

    return <div>ThumbnailPlaceholder</div>
}
