import { WorkspaceFilesPage } from './pages/WorkspaceFilesPage'
import { WorkspaceFileUploadPage } from './pages/WorkspaceFileUploadPage'
import { WorkspaceFolderPage } from './pages/WorkspaceFolderPage'

export const workspaceFileRoutes = {
    path: 'files',
    children: [
        {
            path: '',
            element: <WorkspaceFilesPage />,
        },
        {
            path: 'upload',
            element: <WorkspaceFileUploadPage />
        },
        {
            path: 'folders',
            children: [
                {
                    path: ':folderId',
                    element: <WorkspaceFolderPage />,
                }
            ]
        }
    ]
}