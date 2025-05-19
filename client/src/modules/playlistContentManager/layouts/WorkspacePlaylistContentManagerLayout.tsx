import { ReactNode } from 'react'
import { PlaylistContentManagerHeader } from '../components/PlaylistContentManagerHeader'

export const WorkspacePlaylistContentManagerLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className='grow flex flex-col'>
            <PlaylistContentManagerHeader />
            <div className='z-0 grow flex flex-col'>
                { children }
            </div>
        </div>
    )
}
