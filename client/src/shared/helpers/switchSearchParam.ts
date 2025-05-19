type FilterType = 'status' | 'type' | 'page' | 'limit' | 'search' | 'has_screens' | 'has_content';

export const switchSearchParam = (
    filterType: FilterType,
    value: string
) => {
    const params = new URLSearchParams(window.location.search)
    const currentFilter = params.get(filterType)?.split(',') || []
    const filterSet = new Set(currentFilter)
    
    if (filterSet.has(value)) {
        filterSet.delete(value)
    } else {
        filterSet.add(value)
    }
    
    const sortedFilter = Array.from(filterSet).sort()

    return sortedFilter
}