import { uploadFilePartRequest, UploadFilePartRequestData } from '../api/requests/uploadFilePartRequest'
import { AxiosProgressEvent, isAxiosError } from 'axios'
import { FileUploadingData, FileUploadSession } from '../types'

const CHUNK_SIZE = 20 * 1024 * 1024 // size in bytes

const handleUploadError = (
    error: unknown,
    id: string,
    controller: AbortController | null,
    newController: AbortController,
    pauseFile: (id: string) => void,
    setError: (id: string, error: 'UNKNOWN_ERROR' | 'SESSION_INIT_FAILED' | '404' | '403' | null) => void
) => {
    if (isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
            if (controller === newController) {
                pauseFile(id)
            }
            return
        } else {
            pauseFile(id)
        }

        switch (error.response?.status) {
            case 403:
                setError(id, '403')
                return
            case 404:
                setError(id, '404')
                return
            default:
                setError(id, 'UNKNOWN_ERROR')
        }
    }
}

export const handleUploadNextChunk = async (
    data: FileUploadingData,
    offset: number,
    updateFileUploadingState: (id: string, session: FileUploadSession) => void,
    updateFileUploadingProgress: (id: string, loaded: number) => void,
    setController: (id: string, controller: AbortController) => void,
    pauseFile: (id: string) => void,
    setError: (id: string, error: 'UNKNOWN_ERROR' | 'SESSION_INIT_FAILED' | '404' | '403' | '401' | null) => void
) => {
    const { id, file, controller, session, isPaused } = data

    if (!session || isPaused || controller) {
        return
    }

    const newController = new AbortController()

    setController(id, newController)

    const chunk = file.slice(offset, Math.min(offset + CHUNK_SIZE, file.size))

    const uploadData: UploadFilePartRequestData = {
        filePart: chunk,
        sessionId: session.id,
        workspaceId: session.workspaceId,
        onProgress: (progress: AxiosProgressEvent) => updateFileUploadingProgress(id, progress.loaded),
        abortController: newController
    }

    try {
        const fileUploadSession = await uploadFilePartRequest(uploadData)

        updateFileUploadingState(id, fileUploadSession)

        const uploaded = parseInt(fileUploadSession.uploaded.toString())
        const size = parseInt(fileUploadSession.size.toString())

        if (uploaded < size) {
            await handleUploadNextChunk(data, uploaded, updateFileUploadingState, updateFileUploadingProgress, setController, pauseFile, setError)
        } else {
            pauseFile(id)
        }
    } catch (error: unknown) {
        handleUploadError(error, id, controller, newController, pauseFile, setError)
    }
}
