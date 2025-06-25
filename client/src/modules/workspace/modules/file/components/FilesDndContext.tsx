import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, pointerWithin, useSensor, useSensors } from '@dnd-kit/core'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'
import { ReactNode } from 'react'
import { snapLeftTopToCursor } from '../utils/snapLeftTopToCursor'
import { useDragStore } from '@stores/useDragStore'

export const FilesDndContext = ({ children }: { children: ReactNode }) => {
    const { selectedItems, setDragging, selectItem, clearSelection, isSelected } = useSelectionStore(useShallow((state) => ({
        selectedItems: state.selectedItems,
        setDragging: state.setDragging,
        selectItem: state.selectItem,
        clearSelection: state.clearSelection,
        isSelected: state.isSelected,
    })))

    const { draggedItem, setDraggedItem } = useDragStore()

    const selectedCount = Object.keys(selectedItems).length

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event

        if (active.data.current?.file && !isSelected(active.data.current.file.id)) {
            clearSelection()
            selectItem({ item: active.data.current.file, entity: 'file' })
        }

        if (active.data.current?.folder && !isSelected(active.data.current.folder.id)) {
            clearSelection()
            selectItem({ item: active.data.current.folder, entity: 'folder' })
        }

        setDragging(true)
        setDraggedItem(active)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { over } = event

        setDragging(false)

        if (!over || selectedItems[over.id]) return

        console.log(event.active.data.current?.action)

        setDraggedItem(null)
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
                {
                    draggedItem && (
                        draggedItem.data.current ? (
                            <div className='rounded-md p-2 flex items-center justify-center shadow-lg bg-slate-100 w-[150px]'>
                                { selectedCount }
                            </div>
                        ) : null
                    )
                }
            </DragOverlay>
        </DndContext>
    )
}
