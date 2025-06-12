import { FileThumbnail } from '@workspaceModules/file/components/FileThumbnail'
import { PlaylistContentManagerItem } from '@modules/workspace/modules/playlist/types'

export const SectionItemsFileItemCardBody = ({ item }: { item: PlaylistContentManagerItem }) => {
    const { file } = item

    if(!file) {
        return <div>File not found</div>
    }

    return (
        <div>
            <div className='w-14 h-14'>
                <FileThumbnail file={ file } />
            </div>
        </div>
    )
}
