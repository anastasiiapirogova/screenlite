import { FileUploadingData } from '../types'
import { Button } from '@/shared/ui/buttons/Button'
import { fileUploadService } from '../services/FileUploadService'

const ResumeButton = ({ onClick }: { onClick: () => void }) => (
    <div onClick={ onClick }>
        Resume
    </div>
)

const ErrorResumeButton = ({ onClick }: { onClick: () => void }) => (
    <div onClick={ onClick }>
        Resume
    </div>
)

export const FileUploadingControls = ({ data }: { data: FileUploadingData }) => {
    const { id, status, session } = data

    const isPaused = status === 'paused'

    const isUploaded = session && session.uploaded === session.size

    if(isUploaded) {
        return null
    }

    const MainControl = () => {
        if(isPaused) {
            if(session) {
                return (
                    <ErrorResumeButton onClick={ () => fileUploadService.restartUploading(id) } />
                )
            }
			
            if(session) {
                return (
                    <ResumeButton onClick={ () => fileUploadService.resumeFile(id) } />
                )
            }
        }

        return null
    }

    const cancel = async () => {
        fileUploadService.cancelUpload(id)
    }

    return (
        <div>
            <MainControl />
            <Button onClick={ cancel }>Cancel</Button>
        </div>
    )
}