import { usePlaylist } from '@modules/playlist/hooks/usePlaylist.js'
import { PlaylistContentManagerDndContext } from '../components/PlaylistContentManagerDndContext.js'
import { PlaylistContentManagerItems } from '../components/PlaylistContentManagerItems.js'
import { PlaylistContentManagerMediaLibrary } from '../components/PlaylistContentManagerMediaLibrary.js'
import { PlaylistContentManagerPlaylistSections } from '../components/PlaylistContentManagerPlaylistSections.js'
import { WorkspacePlaylistContentManagerLayout } from '../layouts/WorkspacePlaylistContentManagerLayout.js'
import { PlaylistContentManagerNoLayoutError } from '../components/PlaylistContentManagerNoLayoutError.js'

export const WorkspacePlaylistContentManagerPage = () => {
    const playlist = usePlaylist()

    const Layout = WorkspacePlaylistContentManagerLayout

    if(!playlist.layout) {
        return (
            <Layout>
                <PlaylistContentManagerNoLayoutError />
            </Layout>
        )
    }

    return (
        <Layout>
            <PlaylistContentManagerDndContext>
                <div className='flex grow'>
                    <div className='w-[460px] border-r'>
                        <PlaylistContentManagerMediaLibrary />
                    </div>
                    <div className='flex flex-col grow'>
                        <PlaylistContentManagerItems />
                    </div>
                    <div className='w-[250px] border-l'>
                        <PlaylistContentManagerPlaylistSections />
                    </div>
                </div>
            </PlaylistContentManagerDndContext>
        </Layout>
    )
}
