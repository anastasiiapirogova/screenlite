import { FileThumbnail } from '@modules/file/components/FileThumbnail'
import { WorkspaceFile } from '@modules/file/types'
import { Button } from '@shared/ui/buttons/Button'
import { usePlaylistContentManagerStorage } from '@stores/usePlaylistContentManagerStorage'
import { TbPlus } from 'react-icons/tb'

export const FileSelectorFileCard = ({ file }: { file: WorkspaceFile }) => {
    const { addItemsToCurrentLayoutSection } = usePlaylistContentManagerStorage()

    const addItem = () => {
        addItemsToCurrentLayoutSection('file', file)
    }

    return (
        <div className='px-4 py-2 relative flex justify-between items-center gap-5 hover:bg-neutral-50 select-none'>
            <div className='flex gap-5'>
                <div className='w-20 h-20'>
                    <FileThumbnail file={ file } />
                </div>
                { file.name }
            </div>
            <div>
                <Button
                    size='squareSmall'
                    color='secondary'
                    variant='soft'
                    onClick={ () => addItem() }
                    icon={ TbPlus }
                />
            </div>
        </div>
    )
}