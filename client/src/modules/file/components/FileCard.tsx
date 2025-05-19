import { WorkspaceFile } from '../types'
import { FileThumbnail } from './FileThumbnail'

export const FileCard = ({ file }: { file: WorkspaceFile }) => {
    return (
        <div>
            <FileThumbnail file={ file }/>
            { file.name }
        </div>
    )
}