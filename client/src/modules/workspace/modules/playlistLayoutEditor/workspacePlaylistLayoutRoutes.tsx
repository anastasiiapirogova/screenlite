import { PlaylistLayoutProvider } from '@modules/workspace/modules/playlistLayout/providers/PlaylistLayoutProvider'
import { WorkspacePlaylistLayoutEditorPage } from './pages/WorkspacePlaylistLayoutEditorPage'

export const workspacePlaylistLayoutEditorRoutes = {
    path: 'layouts/:playlistLayoutId/edit',
    element: <PlaylistLayoutProvider />,
    children: [
        {
            path: '',
            element: <WorkspacePlaylistLayoutEditorPage />,
        },
    ]
}