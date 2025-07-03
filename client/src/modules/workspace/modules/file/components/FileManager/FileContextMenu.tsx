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

    const isSingle = filesToActOn.length === 1

    const options = [
        ...(isSingle ? [
            { label: 'Open', action: () => console.log('Open', filesToActOn) },
            { label: 'Rename', action: () => console.log('Rename', filesToActOn) },
            { label: 'Download', action: () => console.log('Download', filesToActOn) },
        ] : []),
        { label: 'Move', action: () => console.log('Move', filesToActOn) },
        { label: 'Trash', action: () => console.log('Trash', filesToActOn) },
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