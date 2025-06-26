import { useMoveFiles } from './useMoveFiles'
import { useMoveFolders } from './useMoveFolders'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useDragStore } from '@stores/useDragStore'

export const useMoveOperations = () => {
    const { clearSelection } = useSelectionStore()
    const { setDraggedItem } = useDragStore()

    const onSuccessMove = () => {
        clearSelection()
        setDraggedItem(null)
    }

    const { moveFiles } = useMoveFiles({ onSuccessMove })
    const { moveFolders } = useMoveFolders({ onSuccessMove })

    return {
        moveFiles,
        moveFolders
    }
} 