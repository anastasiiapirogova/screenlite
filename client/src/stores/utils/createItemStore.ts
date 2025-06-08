import { create } from 'zustand'

export interface BaseItem<T> {
	data: T
	selected: boolean
}

interface WithId {
	id: string
}

interface ItemStore<T extends WithId> {
	items: Record<string, BaseItem<T>>
	addItem: (item: T) => void
	selectItem: (id: string) => void
	unselectItem: (id: string) => void
	deleteItem: (id: string) => void
	getSelectedItems: () => BaseItem<T>[]
}

export const createItemStore = <T extends WithId>() =>
    create<ItemStore<T>>((set, get) => ({
        items: {},

        addItem: (item) =>
            set((state) => ({
                items: {
                    ...state.items,
                    [item.id]: {
                        data: item,
                        selected: false,
                    },
                },
            })),

        selectItem: (id) =>
            set((state) => {
                const updatedItems: Record<string, BaseItem<T>> = {}

                for (const [key, item] of Object.entries(state.items)) {
                    updatedItems[key] = {
                        ...item,
                        selected: key === id,
                    }
                }

                return { items: updatedItems }
            }),

        unselectItem: (id) =>
            set((state) => {
                const item = state.items[id]

                if (!item) return {}

                return {
                    items: {
                        ...state.items,
                        [id]: {
                            ...item,
                            selected: false,
                        },
                    },
                }
            }),

        deleteItem: (id) =>
            set((state) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [id]: _, ...rest } = state.items

                return { items: rest }
            }),

        getSelectedItems: () =>
            Object.values(get().items).filter((item) => item.selected),
    }))
