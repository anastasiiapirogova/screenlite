import { useEffect } from 'react'
import { useFileUploadingStorage } from '@stores/useFileUploadingStorage'
import { FileUploadingData } from '../types'
import { handleUploadNextChunk } from '../utils/handleUploadNextChunk'

export const useFileUploader = (data: FileUploadingData) => {
    const { updateFileUploadingState, updateFileUploadingProgress, setController, pauseFile, setError } = useFileUploadingStorage()

    useEffect(() => {
        handleUploadNextChunk(data, 0, updateFileUploadingState, updateFileUploadingProgress, setController, pauseFile, setError)
    }, [data, pauseFile, setController, setError, updateFileUploadingProgress, updateFileUploadingState])
}