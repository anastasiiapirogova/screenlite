import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { workspaceFolderQuery } from '../api/queries/workspaceFolderQuery'
import { useDeferredLoading } from '@shared/hooks/useDeferredLoading'
import { WorkspaceFolderRequestResponse } from '../api/requests/workspaceFolderRequest'
import { CreateFolderButton } from '../components/buttons/CreateFolderButton'
import { Button } from '@shared/ui/buttons/Button'
import { FolderList } from '../components/FolderList'
import { DeleteFoldersButton } from '../components/buttons/DeleteFoldersButton'

const WorkspaceFolder = ({ data }: { data: WorkspaceFolderRequestResponse }) => {
    return (
        <div>
            <DeleteFoldersButton folderIds={ data.folder.id }>
                <Button>
                    Delete folder
                </Button>
            </DeleteFoldersButton>
            <CreateFolderButton parentId={ data.folder.id }>
                <Button>
                    Create folder
                </Button>
            </CreateFolderButton>
            <div>
                { data.folder.name }
            </div>
            <FolderList parentId={ data.folder.id }/>
        </div>
    )
}

export const WorkspaceFolderPage = () => {
    const params = useParams<{ folderId: string }>()
    
    const { data, isLoading, isSuccess } = useQuery(workspaceFolderQuery({
        folderId: params.folderId!
    }))

    const deferredIsLoading = useDeferredLoading(isLoading, { delay: 0, minDuration: 500 })

    if(!isSuccess) {
        return (
            <div>
                { deferredIsLoading ? 'Loading...' : 'Error' }
            </div>
        )
    }

    return (
        <div>
            <WorkspaceFolder data={ data }/>
        </div>
    )
}
