import { useNavigate } from 'react-router'
import { Playlist } from '../types'
import { useWorkspaceRoutes } from '@/modules/workspace/hooks/useWorkspaceRoutes'
import { usePreviousUrlParamsStorage } from '@stores/usePreviousUrlParamsStorage'
import { prettySize } from '@shared/helpers/prettySize'

export const WorkspacePlaylistsPlaylistCard = ({ playlist }: { playlist: Playlist }) => {
    const routes = useWorkspaceRoutes()
    const { setUrlParams } = usePreviousUrlParamsStorage()
    const navigate = useNavigate()

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()

        const params = new URLSearchParams(window.location.search)
        const paramsObject: { [key: string]: string } = {}

        params.forEach((value, key) => {
            paramsObject[key] = value
        })
        
        setUrlParams(paramsObject)
        navigate(routes.playlist(playlist.id))
    }

    return (
        <a
            href={ routes.playlist(playlist.id) }
            onClick={ handleClick }
            className='block w-full hover:bg-neutral-50 p-4 rounded-xl transition-colors border border-neutral-200'
        >
        
            <div className='flex items-center justify-between'>
                <div className='text-xl font-medium h-10 flex items-center'>
                    { playlist.name }
                </div>
                <div>
                    { playlist.isPublished }
                </div>
            </div>
            <div className='flex gap-5 text-sm'>
                <div>
                    { playlist.type }
                </div>
                <div>
                    { playlist._count.items }
                </div>
                <div>
                    { playlist._count.screens }
                </div>
                <div>
                    { prettySize(playlist.size) }
                </div>
            </div>
        </a>
    )
}
