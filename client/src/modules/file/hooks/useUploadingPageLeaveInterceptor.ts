import { useConfirmationDialogStore } from '@stores/useConfirmationDialogStore'
import { useFileUploadingStorage } from '@stores/useFileUploadingStorage'
import { useEffect, useState } from 'react'
import { useBlocker } from 'react-router'

export const useUploadingPageLeaveInterceptor = () => {
    const [isUploading, setIsUploading] = useState(false)
    const { queue, emptyQueue } = useFileUploadingStorage()
    const { confirm } = useConfirmationDialogStore()
    const blocker = useBlocker(isUploading)

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
                    emptyQueue()
                    blocker.proceed()
                } else {
                    blocker.reset()
                }
            }
        }
        handleBlocker()
    }, [blocker, confirm, emptyQueue])
}
