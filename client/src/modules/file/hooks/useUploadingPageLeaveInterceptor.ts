import { useConfirmationDialogStore } from '@stores/useConfirmationDialogStore'
import { useEffect, useState } from 'react'
import { useBlocker } from 'react-router'
import { fileUploadService } from '../services/FileUploadService'
import { FileUploadingData } from '../types'

export const useUploadingPageLeaveInterceptor = () => {
    const [isUploading, setIsUploading] = useState(false)
    const [queue, setQueue] = useState<FileUploadingData[]>([])
    const { confirm } = useConfirmationDialogStore()
    const blocker = useBlocker(isUploading)

    useEffect(() => {
        const unsubscribe = fileUploadService.subscribe(setQueue)

        return unsubscribe
    }, [])

    useEffect(() => {
        if (
            queue.length > 0 &&
			queue.every(item => item.progress === 100 && !item.error)
        ) {
            setIsUploading(false)
        } else if (queue.length > 0) {
            setIsUploading(true)
        } else {
            setIsUploading(false)
        }
    }, [queue])

    useEffect(() => {
        async function handleBlocker() {
            if(blocker.state === 'blocked') {
                const confirmed = await confirm({
                    title: 'Leave page?',
                    message: 'You have incomplete file uploads. If you leave now, your upload progress will be lost.',
                    confirmText: 'Leave',
                    cancelText: 'Stay',
                    variant: 'danger'
                })

                if(confirmed) {
                    fileUploadService.emptyQueue()
                    blocker.proceed()
                } else {
                    blocker.reset()
                }
            }
        }
        handleBlocker()
    }, [blocker, confirm])
}
