import { DndContext, DragOverlay, PointerSensor, pointerWithin, useSensor, useSensors } from '@dnd-kit/core'
import { ReactNode } from 'react'
import { snapLeftTopToCursor } from '../../utils/snapLeftTopToCursor'
import { useDragStore } from '@stores/useDragStore'
import { useFileDragHandlers } from '../../hooks/useFileDragHandlers'
import { DragOverlayContent } from './DragOverlayContent'

export const FilesDndContext = ({ children }: { children: ReactNode }) => {
    const { draggedItem } = useDragStore()
    const { handleDragStart, handleDragEnd } = useFileDragHandlers()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10
            }
        })
    )

    return (
        <DndContext
            onDragStart={ handleDragStart }
            onDragEnd={ handleDragEnd }
            modifiers={ draggedItem ? draggedItem.data.current?.modifiers : [] }
            collisionDetection={ pointerWithin }
            sensors={ sensors }
        >
            { children }
            <DragOverlay
                dropAnimation={ null }
                modifiers={ [snapLeftTopToCursor] }
            >
                <DragOverlayContent />
            </DragOverlay>
        </DndContext>
    )
}
