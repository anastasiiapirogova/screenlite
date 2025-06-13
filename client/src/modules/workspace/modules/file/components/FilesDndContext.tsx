import { DndContext, DragEndEvent, DragOverlay, PointerSensor, pointerWithin, useSensor, useSensors } from '@dnd-kit/core'
import { useSelectionStore } from '@stores/createItemStore'
import { useShallow } from 'zustand/react/shallow'
import { ReactNode } from 'react'
import { snapLeftTopToCursor } from '../utils/snapLeftTopToCursor'
import { useDragStore } from '@stores/useDragStore'

export const FilesDndContext = ({ children }: { children: ReactNode }) => {
    const { selectedItems } = useSelectionStore(useShallow((state) => ({
        selectedItems: state.selectedItems,
    })))

    const { draggedItem, setDraggedItem } = useDragStore()

    const selectedCount = Object.keys(selectedItems).length

    const handleDragEnd = (event: DragEndEvent) => {
        const { over } = event

        if (!over || selectedItems[over.id]) return

        console.log(over)
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10
            }
        })
    )

    return (
        <DndContext
            onDragStart={ ({ active }) => {
                setDraggedItem(active)
            } }
            onDragEnd={ (event) =>  {
                handleDragEnd(event)
                setDraggedItem(null)
            } }
            modifiers={ draggedItem ? draggedItem.data.current?.modifiers : [] }
            collisionDetection={ pointerWithin }
            sensors={ sensors }
        >
            { children }
            <DragOverlay
                dropAnimation={ null }
                modifiers={ [snapLeftTopToCursor] }
            >
                {
                    draggedItem && (
                        draggedItem.data.current ? (
                            <div className='rounded-md p-2 flex items-center justify-center shadow bg-slate-600'>
                                { selectedCount }
                            </div>
                        ) : null
                    )
                }
            </DragOverlay>
        </DndContext>
    )
}
