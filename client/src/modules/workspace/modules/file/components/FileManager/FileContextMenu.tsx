import { ContextMenu } from '@shared/ui/ContextMenu'
import { WorkspaceFile } from '../../types'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'

interface FileContextMenuProps {
    anchorPoint: { x: number; y: number }
    open: boolean
    onClose: () => void
    data: unknown
}

export const FileContextMenu = ({ anchorPoint, open, onClose, data }: FileContextMenuProps) => {
    const { isSelected, getSelectedItems } = useSelectionStore(useShallow((state) => ({
        isSelected: state.isSelected,
        getSelectedItems: state.getSelectedItems,
    })))

    const clickedFile = data as WorkspaceFile

    const filesToActOn = (() => {
        const isClickedFileSelected = isSelected(clickedFile.id)
        
        if (isClickedFileSelected) {
            return getSelectedItems()
                .filter(item => item.entity === 'file')
                .map(item => item.item as WorkspaceFile)
        } else {
            return [clickedFile]
        }
    })()

    const options = [
        { label: 'Download', action: () => console.log('Download', filesToActOn) },
        { label: 'Open', action: () => console.log('Open', filesToActOn) },
        { label: 'Trash', action: () => console.log('Trash', filesToActOn) },
        { label: 'Move', action: () => console.log('Move', filesToActOn) },
        { label: 'Rename', action: () => console.log('Rename', filesToActOn) },
    ]

    return (
        <ContextMenu
            anchorPoint={ anchorPoint }
            open={ open }
            onClose={ onClose }
            options={ options }
        />
    )
} 