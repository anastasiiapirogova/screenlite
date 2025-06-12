import { Active, closestCorners, DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { ReactNode, useState } from 'react'
import { PlaylistLayoutSectionCard } from './PlaylistLayoutSectionCard'
import { usePlaylistLayoutEditorStorage } from '@stores/usePlaylistLayoutEditorStorage'

export const PlaylistLayoutEditorDndContext = ({ children }: { children: ReactNode }) => {
    const {
        sections,
        reorderLayoutSections
    } = usePlaylistLayoutEditorStorage()

    const [active, setActive] = useState<Active | null>(null)

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active: draggedItem } = event

        if (!over || draggedItem.id === over.id) return

        const action = draggedItem.data.current?.action

        if (action !== 'sort' || !sections) return

        const activeIndex = sections.findIndex(({ id }) => id === draggedItem.id)
        const overIndex = sections.findIndex(({ id }) => id === over.id)

        reorderLayoutSections(arrayMove(sections, activeIndex, overIndex))
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
            collisionDetection={ closestCorners }
        >
            { children }
            <DragOverlay>
                {
                    (active && active.data.current?.section) ? (
                        <PlaylistLayoutSectionCard
                            section={ active.data.current.section }
                            isDragging={ true }
                        /> 
                    ) : null
                }
            </DragOverlay>
        </DndContext>
    )
}
