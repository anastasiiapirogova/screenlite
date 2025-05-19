import { useFileUploader } from '../hooks/useFileUploader'
import { useInitFileUploadingSession } from '../hooks/useInitFileUploadingSession'
import { FileUploadingData } from '../types'

export const FileUploadingRunner = ({ data }: { data: FileUploadingData }) => {
    useFileUploader(data)
    useInitFileUploadingSession(data)

    return null
}
