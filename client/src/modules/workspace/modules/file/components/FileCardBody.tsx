import { WorkspaceFile } from '../types'
import { getFileThumbnailSrc } from '../utils/getFileThumbnailSrc'

export const FileCardBody = ({ file }: { file: WorkspaceFile }) => {
    return (
        <div className="p-3 border">
            <div className='flex items-center gap-2'>
                <div>
                    {
                        file.previewPath || file.type === 'image' ? (
                            <img
                                src={ getFileThumbnailSrc(file.previewPath || file.path) }
                                alt={ file.name }
                                className='w-20 h-20 object-cover rounded-md'
                            />
                        ) : (
                            <div className='w-20 h-20 bg-gray-200 rounded-md'></div>
                        )
                    }
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='text-sm font-medium'>{ file.name }</div>
                </div>
            </div>
        </div>
    )
}
