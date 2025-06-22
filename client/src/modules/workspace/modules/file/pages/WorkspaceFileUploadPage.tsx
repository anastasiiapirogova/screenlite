import { useEffect, useState } from 'react'
import { UploadFilesDropzone } from '../components/UploadFilesDropzone'
import { FileUploadingCard } from '../components/FileUploadingCard'
import { FileUploadingStatus } from '../components/FileUploadingStatus'
import { useUploadingPageLeaveInterceptor } from '../hooks/useUploadingPageLeaveInterceptor'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { fileUploadService } from '../services/FileUploadService'
import { FileUploadingData } from '../types'

export const WorkspaceFileUploadPage = () => {
    const [queue, setQueue] = useState<FileUploadingData[]>([])

    useEffect(() => {
        const unsubscribe = fileUploadService.subscribe(setQueue)
        
        return unsubscribe
    }, [])

    useUploadingPageLeaveInterceptor()
	
    return (
        <LayoutBodyContainer>
            <ScrollArea verticalMargin={ 24 }>
                <div className='max-w-screen-md w-full mx-auto p-7'>
                    <UploadFilesDropzone />
                    <FileUploadingStatus />
                    { queue.map((data) => (
                        <FileUploadingCard
                            data={ data }
                            key={ data.id }
                        />   
                    )) }
                </div>
            </ScrollArea>
        </LayoutBodyContainer>
    )
}
