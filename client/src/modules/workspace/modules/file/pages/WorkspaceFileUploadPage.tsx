import { useFileUploadingStorage } from '@stores/useFileUploadingStorage'
import { UploadFilesDropzone } from '../components/UploadFilesDropzone'
import { FileUploadingCard } from '../components/FileUploadingCard'
import { FileUploader } from '../components/FileUploader'
import { useUploadingPageLeaveInterceptor } from '../hooks/useUploadingPageLeaveInterceptor'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'

export const WorkspaceFileUploadPage = () => {
    const { queue } = useFileUploadingStorage()

    useUploadingPageLeaveInterceptor()
	
    return (
        <LayoutBodyContainer>
            <ScrollArea verticalMargin={ 24 }>
                <div className='max-w-screen-md w-full mx-auto p-7'>
                    <UploadFilesDropzone />
                    <FileUploader />
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
