import { Active, closestCorners, DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { ReactNode, useEffect, useState } from 'react'
import { PlaylistSectionItemCard } from './PlaylistSectionItemCard'
import { usePlaylistContentManagerStorage } from '@stores/usePlaylistContentManagerStorage'

export const PlaylistContentManagerDndContext = ({ children }: { children: ReactNode }) => {
    const {
        items,
        currentLayoutSectionItems,
        updateCurrentLayoutSectionItems,
        currentLayoutSection,
        reorderLayoutSectionItems
    } = usePlaylistContentManagerStorage()
    
    useEffect(() => {
        updateCurrentLayoutSectionItems()
    }, [items, currentLayoutSection, updateCurrentLayoutSectionItems])

    const [active, setActive] = useState<Active | null>(null)

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active: draggedItem } = event

        if (!over || draggedItem.id === over.id) return

        const action = draggedItem.data.current?.action

        if (action !== 'sort' || !currentLayoutSectionItems || !currentLayoutSection) return

        const activeIndex = currentLayoutSectionItems.findIndex(({ id }) => id === draggedItem.id)
        const overIndex = currentLayoutSectionItems.findIndex(({ id }) => id === over.id)

        reorderLayoutSectionItems(currentLayoutSection, arrayMove(currentLayoutSectionItems, activeIndex, overIndex))
    }

    return (
        <DndContext
            onDragStart={ ({ active }) => {
                setActive(active)
            } }
            onDragEnd={ (event) =>  {
                handleDragEnd(event)
                setActive(null)
            } }
            modifiers={ active ? active.data.current?.modifiers : [] }
            collisionDetection={ closestCorners }
        >
            { children }
            <DragOverlay>
                {
                    (active && active.data.current?.item) ? (
                        <PlaylistSectionItemCard
                            item={ active.data.current.item }
                            isDragging={ true }
                        /> 
                    ) : null
                }
            </DragOverlay>
        </DndContext>
    )
}
