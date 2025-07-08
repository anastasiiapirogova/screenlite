import { PlaylistStatusFilter } from './filters/PlaylistStatusFilter'
import { PlaylistTypeFilter } from './filters/PlaylistTypeFilter'
import { PlaylistHasScreensFilter } from './filters/PlaylistHasScreensFilter'
import { PlaylistSearchRouterFilter } from './filters/PlaylistSearchRouterFilter'
import { PlaylistClearFiltersButton } from './filters/PlaylistClearFiltersButton'
import { PlaylistHasContentFilter } from './filters/PlaylistHasContentFilter'
import { ScrollArea } from '@shared/ui/ScrollArea'

export const WorkspacePlaylistsPageSidebar = () => {
    return (
        <>
            <div className='p-7 border-b flex flex-col gap-4'>
                <PlaylistSearchRouterFilter />
                <PlaylistClearFiltersButton />
            </div>
            <ScrollArea verticalMargin={ 24 }>
                <div className='flex flex-col gap-4 p-7'>
                    <PlaylistStatusFilter />
                    <PlaylistTypeFilter />
                    <PlaylistHasScreensFilter />
                    <PlaylistHasContentFilter />
                </div>
            </ScrollArea>
        </>
    )
}
