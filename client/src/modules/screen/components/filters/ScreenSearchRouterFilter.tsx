import { useRouterScreenFilter } from '../../hooks/useRouterScreenFilter'
import { Input } from '@shared/ui/input/Input'

export const ScreenSearchRouterFilter = () => {
    const { search, setSearchTerm } = useRouterScreenFilter()

    return (
        <Input
            value={ search }
            onChange={ (e) => setSearchTerm(e.target.value) }
            placeholder="Search screens..."
        />
    )
}