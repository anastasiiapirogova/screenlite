import { useRouterPlaylistFilter } from '@modules/playlist/hooks/useRouterPlaylistFilter'
import { Button } from '@shared/ui/buttons/Button'

export const PlaylistClearFiltersButton = () => {
    const { hasFilters, clearFilters } = useRouterPlaylistFilter()

    return (
        <Button
            onClick={ clearFilters }
            color='secondary'
            variant='soft'
            size='small'
            disabled={ !hasFilters }
        >
            Clear filters
        </Button>
    )
}
