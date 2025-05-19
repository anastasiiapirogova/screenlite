import { Link } from 'react-router'
import { Screen } from '../types'
import { useWorkspaceRoutes } from '@/modules/workspace/hooks/useWorkspaceRoutes'
import { ScreenStatusBadge } from './ScreenStatusBadge'
import { getScreenTypeLabel } from '../helper/screenTypes'
import { prettyResolution } from '@shared/helpers/prettyResolution'
import pluralize from 'pluralize'

export const WorkspaceScreensScreenCard = ({ screen }: { screen: Screen }) => {
    const routes = useWorkspaceRoutes()

    return (
        <Link
            to={ routes.screen(screen.id) }
            className='block w-full hover:bg-neutral-50 p-4 rounded-xl transition-colors border border-neutral-200'
        >
            
            <div className='flex items-center justify-between'>
                <div className='text-xl font-medium h-10 flex items-center'>
                    { screen.name }
                </div>
                <div>
                    <ScreenStatusBadge screen={ screen }/>
                </div>
            </div>
            <div className='flex gap-5 text-sm'>
                <div>
                    { getScreenTypeLabel(screen.type) }
                </div>
                <div>
                    { prettyResolution(screen.layoutResolution) }
                </div>
                <div>
                    { pluralize('playlist', screen._count.playlists, true) }
                </div>
            </div>
        </Link>
    )
}
