import { TbFolder, TbFiles } from 'react-icons/tb'
import { FolderWithChildrenCount } from '../types'

interface FolderCardBodyProps {
    folder: FolderWithChildrenCount
}

export const FolderCardBody = ({ folder }: FolderCardBodyProps) => {
    const childrenCount = folder._count.files + folder._count.subfolders

    return (
        <div className='flex gap-3 w-full items-center'>
            <div className='flex-shrink-0'>
                <div className='w-16 h-16 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600'>
                    <TbFolder size={ 28 } />
                </div>
            </div>

            <div className='flex-1 min-w-0'>
                <h3
                    className='text-sm font-medium text-gray-900 truncate mb-1'
                    title={ folder.name }
                >
                    { folder.name }
                </h3>

                <div className='space-y-1'>
                    <div className='flex items-center gap-2 text-xs text-gray-500'>
                        <TbFiles size={ 12 } />
                        <span>{ childrenCount } { childrenCount === 1 ? 'item' : 'items' }</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
