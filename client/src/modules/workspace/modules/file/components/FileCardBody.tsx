import { WorkspaceFile } from '../types'
import { getFileThumbnailSrc } from '../utils/getFileThumbnailSrc'
import { useState } from 'react'

export const FileCardBody = ({ file }: { file: WorkspaceFile }) => {
    const [imgError, setImgError] = useState(false)
    const shouldShowPreview = (file.previewPath || file.type === 'image') && !imgError

    return (
        <div className='flex items-center gap-2'>
            <div>
                {
                    shouldShowPreview ? (
                        <div className='w-20 h-20 flex items-center justify-center'>
                            <img
                                src={ getFileThumbnailSrc(file.previewPath || file.path) }
                                alt={ file.name }
                                className='max-h-full max-w-full object-contain rounded'
                                onError={ () => setImgError(true) }
                            />
                        </div>
                    ) : (
                        <div className='w-20 h-20 bg-gray-200 rounded-md'></div>
                    )
                }
            </div>
            <div className='flex flex-col gap-1'>
                <div className='text-sm font-medium'>{ file.name }</div>
            </div>
        </div>
    )
}
