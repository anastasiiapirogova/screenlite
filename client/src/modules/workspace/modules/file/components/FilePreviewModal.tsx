import React from 'react'
import { Modal } from '@shared/ui/modal/Modal'
import { WorkspaceFile } from '../types'
import { prettySize } from '@shared/helpers/prettySize'
import { TbCalendar } from 'react-icons/tb'
import { StorageService } from '@/utils/StorageService'
import { ButtonSpinner } from '@shared/ui/buttons/ButtonSpinner'

interface FilePreviewModalProps {
    open: boolean
    file: WorkspaceFile | null
    onClose: () => void
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ open, file, onClose }) => {
    const [fileLoading, setFileLoading] = React.useState(true)

    React.useEffect(() => {
        setFileLoading(true)
    }, [file?.path])

    if (!file) return null

    return (
        <Modal
            open={ open }
            onOpenChange={ (open) => { if (!open) onClose() } }
            showClose
            fullscreenWithMargin
        >
            <div className="flex flex-row gap-8 min-h-[400px]">
                <div className="flex items-center justify-center grow bg-black overflow-hidden relative">
                    { fileLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <ButtonSpinner className="w-12 h-12 text-white" />
                        </div>
                    ) }
                    { file.type === 'image' && (
                        <img
                            src={ StorageService.getFileSrc(file.path) }
                            alt={ file.name }
                            className={ `w-full h-full object-contain transition-opacity duration-300 ${fileLoading ? 'opacity-0' : 'opacity-100'}` }
                            onLoad={ () => setFileLoading(false) }
                            onError={ () => setFileLoading(false) }
                        />
                    ) }
                    { file.type === 'video' && (
                        <video
                            src={ StorageService.getFileSrc(file.path) }
                            className={ `w-full h-full object-contain bg-black transition-opacity duration-300 ${fileLoading ? 'opacity-0' : 'opacity-100'}` }
                            controls
                            onCanPlayThrough={ () => setFileLoading(false) }
                        />
                    ) }
                </div>
                <div className="flex flex-col gap-3 min-w-0 w-[325px]">
                    <div>
                        <div
                            className="text-lg font-semibold text-gray-900 truncate"
                            title={ file.name }
                        >{ file.name }</div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>{ prettySize(file.size) }</span>
                            <span>•</span>
                            <span>{ file.mimeType.split('/')[1] || file.type }</span>
                        </div>
                    </div>
                    { file.width && file.height && (
                        <div className="text-sm text-gray-500">Resolution: { file.width } × { file.height }</div>
                    ) }
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                        <TbCalendar size={ 14 } />
                        <span>Created: { formatDate(file.createdAt) }</span>
                    </div>
                </div>
            </div>
        </Modal>
    )
} 