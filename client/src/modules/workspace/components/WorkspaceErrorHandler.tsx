import axios from 'axios'
import { WorkspaceForbiddenErrorPage } from '../pages/errors/WorkspaceForbiddenErrorPage'

export const WorkspaceErrorHandler = ({ error }: { error: Error }) => {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
        return <WorkspaceForbiddenErrorPage />
    }

    return (
        <div>WorkspaceErrorHandler</div>
    )
}
