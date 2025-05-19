type FilterType = 'status' | 'type' | 'page' | 'limit' | 'search' | 'has_screens' | 'has_content';

export const updateSearchParam = (
    currentParams: URLSearchParams,
    filterType: FilterType,
    value: string | string[]
): URLSearchParams => {
    const newParams = new URLSearchParams(currentParams)

    if (Array.isArray(value)) {
        if (value.length > 0) {
            newParams.set(filterType, value.join(','))
        } else {
            newParams.delete(filterType)
        }
    } else {
        if (value) {
            newParams.set(filterType, value)
        } else {
            newParams.delete(filterType)
        }
    }

    if(filterType !== 'page') {
        newParams.delete('page')
    }

    return newParams
}