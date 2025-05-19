import { useSearchParams } from 'react-router'

export const useRouterSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const setSearchTerm = (term: string) => {
        setSearchParams(params => {
            if (term) {
                params.set('search', term)
            } else {
                params.delete('search')
            }
            return params
        })
    }

    const searchTerm = searchParams.get('search')

    return { searchTerm: searchTerm || '', setSearchTerm }
}