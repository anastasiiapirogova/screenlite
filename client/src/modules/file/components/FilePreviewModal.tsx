import { Modal } from '@shared/ui/modal/Modal'
import { WorkspaceFile } from '../types'
import { prettySize } from '@shared/helpers/prettySize'
import { TbCalendar } from 'react-icons/tb'
import { StorageService } from '@/utils/StorageService'
import { ButtonSpinner } from '@shared/ui/buttons/ButtonSpinner'
import { useQuery } from '@tanstack/react-query'
import { filePlaylistsQuery } from '../api/filePlaylists'
import { useState } from 'react'

type FilePreviewModalProps = {
    open: boolean
    file: WorkspaceFile | null
    onClose: () => void
}

const Playlists = ({ fileId, workspaceId }: { fileId: string, workspaceId: string }) => {
    const { data: playlists } = useQuery(
        filePlaylistsQuery({ fileId, workspaceId })
    )

    if (!playlists?.length) {
        return (
            <div className='text-sm text-gray-500'>Not used in any playlists</div>
        )
    }

    return (
        <div className='flex flex-col gap-2'>
            <div className='text-sm font-medium text-gray-900'>Used in playlists</div>
            { playlists?.map((playlist) => (
                <div key={ playlist.id }>
                    <div className='text-sm font-medium text-gray-900'>{ playlist.name }</div>
                    <div className='text-sm text-gray-500'>{ playlist.isPublished ? 'Published' : 'Unpublished' }</div>
                </div>
            )) }
        </div>
    )
}

const FilePreview = ({ file }: { file: WorkspaceFile }) => {
    const [fileLoading, setFileLoading] = useState(true)

    return (
        <>
            { fileLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <ButtonSpinner className="w-12 h-12 text-white" />
                </div>
            ) }
            { file.type === 'image' && (
                <img
                    key={ file.path }
                    src={ StorageService.getFileSrc(file.path) }
                    alt={ file.name }
                    className={ `w-full h-full object-contain transition-opacity duration-300 ${fileLoading ? 'opacity-0' : 'opacity-100'}` }
                    onLoad={ () => setFileLoading(false) }
                    onError={ () => setFileLoading(false) }
                />
            ) }
            { file.type === 'video' && (
                <video
                    key={ file.path }
                    src={ StorageService.getFileSrc(file.path) }
                    className={ `w-full h-full object-contain bg-black transition-opacity duration-300 ${fileLoading ? 'opacity-0' : 'opacity-100'}` }
                    controls
                    onCanPlayThrough={ () => setFileLoading(false) }
                />
            ) }
        </>
    )
}

export const FilePreviewModal = ({ open, file, onClose }: FilePreviewModalProps) => {
    if (!file) return null

    return (
        <Modal
            open={ open }
            onOpenChange={ (open) => { if (!open) onClose() } }
            showClose
            fullscreenWithMargin
        >
            <div className="flex flex-row grow gap-8 min-h-[400px]">
                <div className="flex items-center justify-center grow bg-black overflow-hidden relative">
                    <FilePreview file={ file } />
                </div>
                <div className="flex flex-col gap-3 min-w-0 w-[325px] shrink-0">
                    <div>
                        <div
                            className="text-lg font-semibold text-gray-900 truncate"
                            title={ file.name }
                        >
                            { file.name }
                        </div>
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
                        <span>Created: { file.createdAt }</span>
                    </div>
                    <Playlists
                        fileId={ file.id }
                        workspaceId={ file.workspaceId }
                    />
                </div>
            </div>
        </Modal>
    )
} 