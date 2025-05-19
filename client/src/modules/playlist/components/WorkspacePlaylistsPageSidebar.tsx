import { PlaylistStatusFilter } from './filters/PlaylistStatusFilter'
import { PlaylistTypeFilter } from './filters/PlaylistTypeFilter'
import { PlaylistHasScreensFilter } from './filters/PlaylistHasScreensFilter'
import { PlaylistSearchRouterFilter } from './filters/PlaylistSearchRouterFilter'
import { PlaylistClearFiltersButton } from './filters/PlaylistClearFiltersButton'
import { PlaylistHasContentFilter } from './filters/PlaylistHasContentFilter'

export const WorkspacePlaylistsPageSidebar = () => {
    return (
        <div className='flex flex-col gap-4'>
            <PlaylistSearchRouterFilter />
            <PlaylistClearFiltersButton />
            <PlaylistStatusFilter />
            <PlaylistTypeFilter />
            <PlaylistHasScreensFilter />
            <PlaylistHasContentFilter />
        </div>
    )
}
