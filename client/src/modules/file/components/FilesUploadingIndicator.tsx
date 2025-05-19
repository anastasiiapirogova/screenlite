import { useFileUploadingStorage } from '@stores/useFileUploadingStorage'
import { FileUploadingRunner } from './FileUploadingRunner'

export const FilesUploader = () => {
    const { queue } = useFileUploadingStorage()

    const inProgressFileCount = queue.filter((item) => item.session && item.session.uploaded < item.session.size).length
    const uploadedFiles = queue.filter((item) => item.session && item.session.uploaded === item.session.size).length

    return (
        <>
            {
                inProgressFileCount > 0 || uploadedFiles > 0 && (
                    <div>
                        Uploading { inProgressFileCount }, Uploaded { uploadedFiles }
                    </div>
                )
            }
            {
                queue.map((data) => {
                    return (
                        <FileUploadingRunner
                            key={ data.id }
                            data={ data }
                        />
                    )
                })
            }
        </>
    )
}
