import axios from 'axios'
import { WorkspaceForbiddenErrorPage } from '../pages/errors/WorkspaceForbiddenErrorPage'
import { WorkspaceNotFoundErrorPage } from '../pages/errors/WorkspaceNotFoundErrorPage'
import { WorkspaceLoadingErrorPage } from '../pages/errors/WorkspaceLoadingErrorPage'
import { workspaceQuery } from '../api/requests/workspace'

export const WorkspaceErrorHandler = ({ error, queryKey }: { error: Error | null | undefined, queryKey: ReturnType<typeof workspaceQuery>['queryKey'] }) => {
    if (!error) {
        return <WorkspaceLoadingErrorPage queryKey={ queryKey } />
    }

    if (axios.isAxiosError(error) && error.response?.status === 403) {
        return <WorkspaceForbiddenErrorPage />
    }

    if (axios.isAxiosError(error) && error.response?.status === 404) {
        return <WorkspaceNotFoundErrorPage />
    }

    return <WorkspaceLoadingErrorPage queryKey={ queryKey } />
}
