import { useState, useCallback } from 'react'

export const useSelection = <T,>(initialSelectedItems: T[] = [], key?: keyof T) => {
    const [selectedItems, setSelectedItems] = useState<T[]>(initialSelectedItems)

    const isSelected = useCallback(
        (item: T) => selectedItems.some(selectedItem => key ? selectedItem[key] === item[key] : selectedItem === item),
        [selectedItems, key]
    )

    const selectItem = useCallback(
        (item: T) => {
            if (!isSelected(item)) {
                setSelectedItems(prevSelected => [...prevSelected, item])
            }
        },
        [isSelected]
    )

    const deselectItem = useCallback(
        (item: T) => {
            setSelectedItems(prevSelected =>
                prevSelected.filter(selectedItem => key ? selectedItem[key] !== item[key] : selectedItem !== item)
            )
        },
        [key]
    )

    const toggleItemSelection = useCallback(
        (item: T) => {
            setSelectedItems(prevSelected => {
                if (isSelected(item)) {
                    return prevSelected.filter(selectedItem => key ? selectedItem[key] !== item[key] : selectedItem !== item)
                }
                return [...prevSelected, item]
            })
        },
        [isSelected, key]
    )

    const clearSelection = useCallback(() => {
        setSelectedItems([])
    }, [])

    return {
        selectedItems,
        isSelected,
        selectItem,
        deselectItem,
        toggleItemSelection,
        clearSelection,
    }
}