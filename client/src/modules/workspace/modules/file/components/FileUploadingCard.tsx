import { FileUploadingData } from '../types'
import { FileUploadingControls } from './FileUploadingControls'

export const FileUploadingCard = ({ data }: { data: FileUploadingData }) => {
    const isUploaded = data.session && data.session.uploaded === data.session.size

    return (
        <div>
            { data.file.name }
            { !isUploaded && (
                <div>
                    { data.error && <div>Error: { data.error }</div> }
                    <div>
                        { data.progress.toFixed(2) }%
                    </div>
                </div>
            ) }
            <FileUploadingControls data={ data }/>
        </div>
    )
}