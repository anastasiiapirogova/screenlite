import { Active } from '@dnd-kit/core'
import { create } from 'zustand'

interface DragStore {
    draggedItem: Active | null
    setDraggedItem: (item: Active | null) => void
}

export const useDragStore = create<DragStore>((set) => ({
    draggedItem: null,
    setDraggedItem: (item) => set({ draggedItem: item }),
})) 