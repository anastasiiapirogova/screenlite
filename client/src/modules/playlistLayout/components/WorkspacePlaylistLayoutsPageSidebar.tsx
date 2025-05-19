import { Input } from '@shared/ui/input/Input'
import { useRouterPlaylistLayoutFilter } from '../hooks/useRouterPlaylistLayoutFilter'

export const WorkspacePlaylistLayoutsPageSidebar = () => {
    const { search, setSearch } = useRouterPlaylistLayoutFilter()
    
    return (
        <div className='flex flex-col gap-4 items-center'>
            <Input
                value={ search }
                onChange={ (e) => setSearch(e.target.value) }
                placeholder="Search layouts..."
            />
        </div>
    )
}
