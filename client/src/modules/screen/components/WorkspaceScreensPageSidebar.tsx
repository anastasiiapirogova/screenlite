import { ScreenStatusRouterFilter } from './filters/ScreenStatusRouterFilter'
import { ScreenTypeRouterFilter } from './filters/ScreenTypeRouterFilter'
import { ScreenSearchRouterFilter } from './filters/ScreenSearchRouterFilter'
import { ScreenClearFiltersButton } from './filters/ScreenClearFiltersButton'

export const WorkspaceScreensPageSidebar = () => {
    return (
        <div className='flex flex-col gap-4'>
            <ScreenSearchRouterFilter />
            <ScreenClearFiltersButton />
            <ScreenStatusRouterFilter />
            <ScreenTypeRouterFilter />
        </div>
    )
}
