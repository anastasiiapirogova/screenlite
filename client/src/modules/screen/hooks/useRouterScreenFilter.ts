import { useDebounce } from '@uidotdev/usehooks'
import { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router'

export const useRouterScreenFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const setFilter = useCallback((filterType: 'status' | 'type' | 'page' | 'limit' | 'search', value: string | string[]) => {
        setSearchParams(params => {
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    params.set(filterType, value.join(','))
                } else {
                    params.delete(filterType)
                }
            } else {
                if (value) {
                    params.set(filterType, value)
                } else {
                    params.delete(filterType)
                }
            }

            if(filterType !== 'page') {
                params.delete('page')
            }

            return params
        })
    }, [setSearchParams])

    const switchFilter = useCallback((filterType: 'status' | 'type', value: string) => {
        const params = new URLSearchParams(window.location.search)
        const currentFilter = params.get(filterType)?.split(',') || []
        const filterSet = new Set(currentFilter)

        if (filterSet.has(value)) {
            filterSet.delete(value)
        } else {
            filterSet.add(value)
        }

        const sortedFilter = Array.from(filterSet).sort()

        setFilter(filterType, sortedFilter)
    }, [setFilter])

    const clearFilters = useCallback(() => {
        setSearchParams(params => {
            params.delete('status')
            params.delete('type')
            params.delete('page')
            params.delete('limit')
            params.delete('search')

            return params
        })
    }, [setSearchParams])

    const statusSearchParam = searchParams.get('status')
    const pageSearchParam = searchParams.get('page')
    const limitSearchParam = searchParams.get('limit')
    const searchSearchParam = searchParams.get('search')
    const typeSearchParam = searchParams.get('type')

    const statusFilter = useMemo(() => statusSearchParam?.split(',') || [], [statusSearchParam])
    const typeFilter = useMemo(() => typeSearchParam?.split(',') || [], [typeSearchParam])
    const page = useMemo(() => pageSearchParam || '1', [pageSearchParam])
    const limit = useMemo(() => limitSearchParam || '10', [limitSearchParam])
    const search = useMemo(() => searchSearchParam || '', [searchSearchParam])
    const debouncedSearch = useDebounce(search, 300)

    const filters = useMemo(() => {
        return {
            status: statusFilter,
            type: typeFilter,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            search: debouncedSearch,
        }
    }, [statusFilter, typeFilter, page, limit, debouncedSearch])

    const hasFilters = statusFilter.length > 0 || typeFilter.length > 0 || !!search

    return {
        filters,
        search,
        hasFilters,
        setStatusFilter: useCallback((status: string[]) => setFilter('status', status), [setFilter]),
        setTypeFilter: useCallback((type: string[]) => setFilter('type', type), [setFilter]),
        setPage: useCallback((page: number) => setFilter('page', page.toString()), [setFilter]),
        setLimit: useCallback((limit: number) => setFilter('limit', limit.toString()), [setFilter]),
        setSearchTerm: useCallback((search: string) => setFilter('search', search), [setFilter]),
        switchStatusFilter: useCallback((status: string) => switchFilter('status', status), [switchFilter]),
        switchTypeFilter: useCallback((type: string) => switchFilter('type', type), [switchFilter]),
        clearFilters
    }
}