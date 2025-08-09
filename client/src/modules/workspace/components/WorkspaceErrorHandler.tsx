import { WorkspaceForbiddenErrorPage } from '../pages/errors/WorkspaceForbiddenErrorPage'
import { WorkspaceNotFoundErrorPage } from '../pages/errors/WorkspaceNotFoundErrorPage'
import { WorkspaceLoadingErrorPage } from '../pages/errors/WorkspaceLoadingErrorPage'
import { workspaceQuery } from '../api/requests/workspace'
import { isAxiosStatusCode } from '@shared/helpers/isAxiosStatusCode'

export const WorkspaceErrorHandler = ({ error, queryKey }: { error: Error | null | undefined, queryKey: ReturnType<typeof workspaceQuery>['queryKey'] }) => {
    if (isAxiosStatusCode(error, 403)) {
        return <WorkspaceForbiddenErrorPage />
    }

    if (isAxiosStatusCode(error, 404)) {
        return <WorkspaceNotFoundErrorPage />
    }

    return <WorkspaceLoadingErrorPage queryKey={ queryKey } />
}
