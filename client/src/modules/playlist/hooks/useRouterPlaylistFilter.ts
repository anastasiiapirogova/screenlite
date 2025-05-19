import { switchSearchParam } from '@shared/helpers/switchSearchParam'
import { updateSearchParam } from '@shared/helpers/updateSearchParam'
import { useDeepMemo } from '@shared/hooks/useDeepMemo'
import { useDebounce } from '@uidotdev/usehooks'
import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

export const useRouterPlaylistFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const setFilter = useCallback((filterType: 'status' | 'type' | 'page' | 'limit' | 'search' | 'has_screens'  | 'has_content', value: string | string[]) => {
        setSearchParams(params => updateSearchParam(params, filterType, value))
    }, [setSearchParams])

    const switchFilter = useCallback((filterType: 'status' | 'type' | 'has_screens' | 'has_content', value: string) => {
        setFilter(filterType, switchSearchParam(filterType, value))
    }, [setFilter])

    const clearFilters = useCallback(() => {
        setSearchParams({})
    }, [setSearchParams])

    const { 
        status, 
        type, 
        has_screens, 
        has_content, 
        page, 
        limit, 
        search 
    } = useDeepMemo(() => ({
        status: searchParams.get('status')?.split(',') || [],
        type: searchParams.get('type')?.split(',') || [],
        has_screens: searchParams.get('has_screens')?.split(',') || [],
        has_content: searchParams.get('has_content')?.split(',') || [],
        page: searchParams.get('page') || '1',
        limit: searchParams.get('limit') || '20',
        search: searchParams.get('search') || '',
    }), [searchParams])

    const debouncedSearch = useDebounce(search, 300)

    const hasFilters = useMemo(() => (
        status.length > 0 || 
        type.length > 0 || 
        has_screens.length > 0 || 
        search.length > 0 || 
        has_content.length > 0
    ), [status, type, has_screens, search, has_content])

    const filters = useMemo(() => ({
        status,
        type,
        has_screens,
        has_content,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        search: debouncedSearch,
    }), [status, type, has_screens, has_content, page, limit, debouncedSearch])

    return {
        filters,
        ...filters,
        search,
        hasFilters,
        switchFilter,
        setFilter,
        clearFilters,
    }
}