import { useDebounce } from '@uidotdev/usehooks'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'

export const useRouterPlaylistLayoutFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const setFilter = (filterType: 'page' | 'limit' | 'search', value: string | string[]) => {
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
    }

    const page = useMemo(() => searchParams.get('page') || '1', [searchParams])
    const limit = useMemo(() => searchParams.get('limit') || '10', [searchParams])
    const search = useMemo(() => searchParams.get('search') || '', [searchParams])

    const filters = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        search: useDebounce(search, 300),
    }

    return {
        filters,
        ...filters,
        search,
        setSearch: (search: string) => setFilter('search', search),
        setPage: (page: number) => setFilter('page', page.toString()),
        setLimit: (limit: number) => setFilter('limit', limit.toString()),
    }
}