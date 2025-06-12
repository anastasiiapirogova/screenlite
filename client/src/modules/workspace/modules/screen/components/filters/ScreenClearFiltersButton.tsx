import { useRouterScreenFilter } from '@modules/workspace/modules/screen/hooks/useRouterScreenFilter'
import { Button } from '@shared/ui/buttons/Button'

export const ScreenClearFiltersButton = () => {
    const { hasFilters, clearFilters } = useRouterScreenFilter()

    return (
        <Button
            onClick={ clearFilters }
            variant='soft'
            color='secondary'
            size='small'
            disabled={ !hasFilters }
        >
            Clear filters
        </Button>
    )
}
