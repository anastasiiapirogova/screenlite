import { WorkspaceFile } from '../types'
import { FileThumbnail } from './FileThumbnail'
import { prettySize } from '@shared/helpers/prettySize'
import { TbCalendar } from 'react-icons/tb'

export const FileCardBody = ({ file }: { file: WorkspaceFile }) => {
    return (
        <div className="flex items-center gap-4 w-full">
            <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-100 overflow-hidden">
                <FileThumbnail file={ file } />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                <h3
                    className="text-sm font-medium text-gray-900 truncate"
                    title={ file.name }
                >
                    { file.name }
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{ prettySize(file.size) }</span>
                    <span>•</span>
                    <span>{ file.mimeType.split('/')[1] || file.type }</span>
                </div>
                { file.width && file.height && (
                    <div className="text-xs text-gray-500">
                        { file.width } × { file.height }
                    </div>
                ) }
                { file.duration && (
                    <div className="text-xs text-gray-500">
                        { Math.floor(file.duration / 60) }:{ (file.duration % 60).toString().padStart(2, '0') }
                    </div>
                ) }
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <TbCalendar size={ 12 } />
                    <span>{ file.createdAt }</span>
                </div>
            </div>
        </div>
    )
}
