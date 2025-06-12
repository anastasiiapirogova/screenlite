import { Outlet } from 'react-router'
import { usePlaylist } from '../hooks/usePlaylist'
import { InnerSidebarLayout } from '@shared/layouts/InnerSidebarLayout'
import { WorkspacePlaylistPageSidebar } from '../components/WorkspacePlaylistPageSidebar'

export const WorkspacePlaylistLayout = () => {
    const playlist = usePlaylist()

    return (
        <div className='max-w-(--breakpoint-xl) mx-auto w-full pb-20'>
            {
                playlist.deletedAt ? (
                    <div className='bg-red-100 text-red-800 p-4 mb-4'>
                        This playlist has been deleted
                    </div>
                ) : null
            }
            <InnerSidebarLayout sidebar={ <WorkspacePlaylistPageSidebar /> }>
                <Outlet />
            </InnerSidebarLayout>
        </div>
    )
}
