import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { StorageService } from '@/utils/StorageService'
import { ButtonSpinner } from '@shared/ui/buttons/ButtonSpinner'
import { workspaceFileQuery } from '../api/workspaceFile'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'

export const WorkspaceFilePage = () => {
    const { fileId } = useParams<{ fileId: string }>()
    const { id } = useWorkspace()
    const [fileLoading, setFileLoading] = useState(true)

    const { data: file } = useQuery(workspaceFileQuery({
        fileId: fileId!,
        workspaceId: id
    }))

    if (!file) {
        return null
    }

    return (
        <LayoutBodyContainer>
            <div className='p-7'>

                <div>
                    { file.name }
                </div>
                <div className='w-[300px]'>
                    <div className="inset-0 bg-black z-50 flex flex-col grow">
                        <div className="flex-1 flex items-center justify-center relative">
                            { fileLoading && (
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <ButtonSpinner className="w-12 h-12 text-white" />
                                </div>
                            ) }

                            { file.type === 'image' && (
                                <img
                                    src={ StorageService.getFileSrc(file.path) }
                                    alt={ file.name }
                                    className="max-w-full max-h-full object-contain transition-opacity duration-300"
                                    style={ { opacity: fileLoading ? 0 : 1 } }
                                    onLoad={ () => setFileLoading(false) }
                                    onError={ () => setFileLoading(false) }
                                />
                            ) }

                            { file.type === 'video' && (
                                <video
                                    src={ StorageService.getFileSrc(file.path) }
                                    className="max-w-full max-h-full object-contain"
                                    controls
                                    onCanPlay={ () => setFileLoading(false) }
                                />
                            ) }
                        </div>
                    </div>
                </div>
            </div>
        </LayoutBodyContainer>
    )
} 