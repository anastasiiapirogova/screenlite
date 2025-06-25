import { create } from 'zustand'

interface WithId {
	id: string
}

interface SelectionStore {
	selectedItems: Record<string, { item: WithId, entity: 'file' | 'folder' }>
	isDragging: boolean
	selectItem: (data: { item: WithId, entity: 'file' | 'folder' }) => void
    setSelectedItems: (items: Record<string, { item: WithId, entity: 'file' | 'folder' }>) => void
	unselectItem: (id: string) => void
	unselectAllItems: () => void
	clearSelection: () => void
	getSelectedItems: () => { item: WithId, entity: 'file' | 'folder' }[]
	getEntity: () => 'file' | 'folder' | null
	isSelected: (id: string) => boolean
	setDragging: (isDragging: boolean) => void
}

export const useSelectionStore = create<SelectionStore>((set, get) => ({
    selectedItems: {},
    isDragging: false,

    selectItem: ({ item, entity }) =>
        set((state) => {
            const selectedItemsArray = Object.values(state.selectedItems)
            const currentEntity = selectedItemsArray.length > 0 ? selectedItemsArray[0].entity : null
            
            if (currentEntity && currentEntity !== entity) {
                return {
                    selectedItems: {
                        [item.id]: { item, entity },
                    },
                }
            }
            
            return {
                selectedItems: {
                    ...state.selectedItems,
                    [item.id]: { item, entity },
                },
            }
        }),

    setSelectedItems: (items) =>
        set(() => ({ selectedItems: items })),

    unselectItem: (id) =>
        set((state) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [id]: _, ...rest } = state.selectedItems

            return { selectedItems: rest }
        }),

    unselectAllItems: () =>
        set(() => ({ selectedItems: {} })),

    clearSelection: () =>
        set(() => ({ selectedItems: {} })),

    getSelectedItems: () =>
        Object.values(get().selectedItems),

    getEntity: () => {
        const values = Object.values(get().selectedItems)

        return values.length > 0 ? values[0].entity : null
    },

    isSelected: (id) =>
        Boolean(get().selectedItems[id]),

    setDragging: (isDragging) =>
        set(() => ({ isDragging })),
}))