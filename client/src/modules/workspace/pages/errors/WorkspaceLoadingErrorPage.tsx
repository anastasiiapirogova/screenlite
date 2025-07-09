import { useRetryQueryByKey } from '@/hooks/useRetryQueryByKey'
import { workspaceQuery } from '../../api/requests/workspace'
import { Button } from '@shared/ui/buttons/Button'

export const WorkspaceLoadingErrorPage = ({ queryKey }: { queryKey: ReturnType<typeof workspaceQuery>['queryKey'] }) => {
    const { retry } = useRetryQueryByKey(queryKey)

    return (
        <div>
            <h1>Workspace loading error</h1>
            <Button onClick={ retry }>Retry</Button>
        </div>
    )
}