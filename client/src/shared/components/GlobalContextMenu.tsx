import { useContextMenuStore } from '@stores/useContextMenuStore'
import { FileContextMenu } from '@modules/workspace/modules/file/components/FileContextMenu'

export const GlobalContextMenu = () => {
    const { open, anchorPoint, type, data, closeContextMenu } = useContextMenuStore()

    if (!open || !type) return null

    switch (type) {
        case 'file':
            return (
                <FileContextMenu
                    anchorPoint={ anchorPoint }
                    open={ open }
                    onClose={ closeContextMenu }
                    data={ data }
                />
            )
        case 'folder':
            // TODO: Add FolderContextMenu
            return null
        case 'playlist':
            // TODO: Add PlaylistContextMenu
            return null
        case 'screen':
            // TODO: Add ScreenContextMenu
            return null
        default:
            return null
    }
} 