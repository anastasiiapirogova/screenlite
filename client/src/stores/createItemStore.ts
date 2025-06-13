import { create } from 'zustand'

interface WithId {
	id: string
}

interface SelectionStore {
	selectedItems: Record<string, { item: WithId, entity: 'file' | 'folder' }>
	selectItem: (data: { item: WithId, entity: 'file' | 'folder' }) => void
	unselectItem: (id: string) => void
	unselectAllItems: () => void
	clearSelection: () => void
	getSelectedItems: () => { item: WithId, entity: 'file' | 'folder' }[]
	getEntity: () => 'file' | 'folder' | null
	isSelected: (id: string) => boolean
}

export const useSelectionStore = create<SelectionStore>((set, get) => ({
    selectedItems: {},

    selectItem: ({ item, entity }) =>
        set((state) => ({
            selectedItems: {
                ...state.selectedItems,
                [item.id]: { item, entity },
            },
        })),

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
}))