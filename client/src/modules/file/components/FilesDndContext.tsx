import { Active, DndContext, DragEndEvent, DragOverlay, pointerWithin } from '@dnd-kit/core'
import { ReactNode, useState } from 'react'
import { FileCard } from './FileCard'
import { FolderCard } from './FolderCard'

export const FilesDndContext = ({ children }: { children: ReactNode }) => {
    const [active, setActive] = useState<Active | null>(null)

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active: draggedItem } = event

        if (!over || draggedItem.id === over.id) return

        const action = draggedItem.data.current?.action

        console.log(over)
    }

    return (
        <DndContext
            onDragStart={ ({ active }) => {
                setActive(active)
                document.body.style.cursor = 'grabbing'
            } }
            onDragEnd={ (event) =>  {
                handleDragEnd(event)
                setActive(null)
                document.body.style.cursor = ''
            } }
            modifiers={ active ? active.data.current?.modifiers : [] }
            collisionDetection={ pointerWithin }
        >
            { children }
            <DragOverlay>
                {
                    active && (
                        active.data.current?.file ? (
                            <FileCard
                                file={ active.data.current.file }
                                isDragging={ true }
                            />
                        ) : active.data.current?.folder ? (
                            <FolderCard
                                folder={ active.data.current.folder }
                                isDragging={ true }
                            />
                        ) : null
                    )
                }
            </DragOverlay>
        </DndContext>
    )
}
