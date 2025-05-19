import { useFileUploadingStorage } from '@stores/useFileUploadingStorage'
import { UploadFilesDropzone } from '../components/UploadFilesDropzone'
import { FileUploadingCard } from '../components/FileUploadingCard'

export const WorkspaceFileUploadPage = () => {
    const { queue } = useFileUploadingStorage()
    
    return (
        <div>
            <UploadFilesDropzone />
            { queue.map((data) => (
                <FileUploadingCard
                    data={ data }
                    key={ data.id }
                />   
            )) }
        </div>
    )
}
