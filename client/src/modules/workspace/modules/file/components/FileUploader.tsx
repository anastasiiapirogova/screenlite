import { useFileUploadingStorage } from '@stores/useFileUploadingStorage'
import { FileUploadingRunner } from './FileUploadingRunner'

export const FileUploader = () => {
    const { queue } = useFileUploadingStorage()
    
    return (
        <>
            {
                queue.map((file) => (
                    <FileUploadingRunner
                        data={ file }
                        key={ file.id }
                    />
                ))
            }
        </>
    )
}
