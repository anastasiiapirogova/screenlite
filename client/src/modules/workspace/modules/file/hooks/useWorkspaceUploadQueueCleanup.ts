import { useEffect, useRef } from 'react'
import { fileUploadService } from '../services/FileUploadService'
import { useParams } from 'react-router'

export const useWorkspaceUploadQueueCleanup = () => {
    const { workspaceSlug } = useParams<{ workspaceSlug: string }>()
    const previousWorkspaceId = useRef<string | undefined>(undefined)

    useEffect(() => {
        const currentWorkspaceId = workspaceSlug

        if (previousWorkspaceId.current !== currentWorkspaceId) {
            fileUploadService.emptyQueue()
        }

        previousWorkspaceId.current = currentWorkspaceId
    }, [workspaceSlug])
}