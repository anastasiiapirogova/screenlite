import { useContextMenuStore } from '@stores/useContextMenuStore'
import { FileContextMenu } from '@workspaceModules/file/components/FileManager/FileContextMenu'
import { FolderContextMenu } from '@workspaceModules/file/components/FileManager/FolderContextMenu'

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
            return (
                <FolderContextMenu
                    anchorPoint={ anchorPoint }
                    open={ open }
                    onClose={ closeContextMenu }
                    data={ data }
                />
            )
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