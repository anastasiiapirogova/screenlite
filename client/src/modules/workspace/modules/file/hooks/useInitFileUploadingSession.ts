import { useEffect, useRef } from 'react'
import { useFileUploadingStorage } from '@stores/useFileUploadingStorage'
import { createFileUploadSessionRequest, CreateFileUploadSessionRequestData } from '../api/createFileUploadSession'
import { useWorkspace } from '@/modules/workspace/hooks/useWorkspace'
import { FileUploadingData } from '../types'

export const useInitFileUploadingSession = (data: FileUploadingData) => {
    const { id, file, session } = data
    const { id: workspaceId } = useWorkspace()
    const { updateFileUploadingState, setError } = useFileUploadingStorage()
    const sessionRequested = useRef(false)

    useEffect(() => {
        if (session) return

        const initializeUploadSession = async () => {
            if (session || sessionRequested.current) return

            sessionRequested.current = true

            const sessionData: CreateFileUploadSessionRequestData = {
                workspaceId,
                name: file.name,
                size: file.size,
                mimeType: file.type,
                folderId: undefined,
            }

            try {
                const session = await createFileUploadSessionRequest(sessionData)

                updateFileUploadingState(id, session)
            } catch {
                setError(id, 'SESSION_INIT_FAILED')
                sessionRequested.current = false
            }
        }

        initializeUploadSession()
    }, [session, workspaceId, file, id, updateFileUploadingState, setError])
}
