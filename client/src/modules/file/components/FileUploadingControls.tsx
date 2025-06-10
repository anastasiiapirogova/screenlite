import { useFileUploadingStorage } from '@stores/useFileUploadingStorage'
import { FileUploadingData } from '../types'
import { Button } from '@/shared/ui/buttons/Button'
import { cancelFileUploading } from '../utils/cancelFileUploading'

const ResumeButton = ({ onClick }: { onClick: () => void }) => (
    <div onClick={ onClick }>
        Resume
    </div>
)

const PauseButton = ({ onClick }: { onClick: () => void }) => (
    <div onClick={ onClick }>
        Pause
    </div>
)

const ErrorResumeButton = ({ onClick }: { onClick: () => void }) => (
    <div onClick={ onClick }>
        Resume
    </div>
)

export const FileUploadingControls = ({ data }: { data: FileUploadingData }) => {
    const { pauseFile, resumeFile, restartUploading, removeFile } = useFileUploadingStorage()
    const { id, isPaused, error, session } = data

    const isUploaded = session && session.uploaded === session.size

    const isSessionNotFound = error && error === '404'

    if(isUploaded) {
        return null
    }

    const MainControl = () => {
        if(isPaused) {
            if(isSessionNotFound) {
                return (
                    <ErrorResumeButton onClick={ () => restartUploading(id) } />
                )
            }
			
            if(session) {
                return (
                    <ResumeButton onClick={ () => resumeFile(id) } />
                )
            }
        } else {
            return (
                <PauseButton onClick={ () => pauseFile(id) } />
            )
        }

        return null
    }

    const cancel = async () => {
        if (!session || isUploaded) {
            removeFile(id)
            return
        }

        pauseFile(id)

        const success = await cancelFileUploading(session.id, session.workspaceId)

        if (success) {
            removeFile(id)
        }
    }

    return (
        <div>
            <MainControl />
            <Button onClick={ cancel }>Cancel</Button>
        </div>
    )
}