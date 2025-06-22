import { useEffect, useState } from 'react'
import { fileUploadService } from '../services/FileUploadService'
import { FileUploadingData } from '../types'

export const FileUploadingStatus = () => {
    const [queue, setQueue] = useState<FileUploadingData[]>([])
    
    useEffect(() => {
        const unsubscribe = fileUploadService.subscribe(setQueue)

        return unsubscribe
    }, [])
    
    const pendingCount = queue.filter(file => 
        !file.error && 
        !fileUploadService.isUploading(file.id) &&
        (!file.session || parseInt(file.session.uploaded.toString()) < file.file.size)
    ).length
    
    const uploadingCount = fileUploadService.getCurrentlyUploading().length
    const totalCount = queue.length
    
    if (totalCount === 0) return null
    
    return (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
                <div className="font-medium">Upload Status:</div>
                <div className="mt-1">
                    • Currently uploading: { uploadingCount }
                </div>
                <div>
                    • Pending: { pendingCount }
                </div>
                <div>
                    • Total files: { totalCount }
                </div>
            </div>
        </div>
    )
} 