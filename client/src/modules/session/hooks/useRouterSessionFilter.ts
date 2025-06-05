import { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { UserSessionStatus } from '../sessionRoutes'

export const useRouterSessionFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const setFilter = useCallback((
        filterType: 'status' | 'page' | 'limit',
        value: string | string[]
    ) => {
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

            if (filterType !== 'page') {
                params.delete('page')
            }

            return params
        })
    }, [setSearchParams])

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

    const statusFilter = useMemo<UserSessionStatus | undefined>(() => {
        if (!statusSearchParam) return undefined
        return statusSearchParam as UserSessionStatus
    }, [statusSearchParam])

    const page = useMemo(() => pageSearchParam || '1', [pageSearchParam])
    const limit = useMemo(() => limitSearchParam || '10', [limitSearchParam])

    const filters = useMemo(() => {
        return {
            status: statusFilter,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        }
    }, [statusFilter, page, limit])

    const hasFilters = !!statusFilter

    return {
        filters,
        hasFilters,
        setStatusFilter: useCallback((status: UserSessionStatus) => setFilter('status', status), [setFilter]),
        setPage: useCallback((page: number) => setFilter('page', page.toString()), [setFilter]),
        setLimit: useCallback((limit: number) => setFilter('limit', limit.toString()), [setFilter]),
        clearFilters
    }
}