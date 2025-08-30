import { Outlet, useParams } from 'react-router'
import { WorkspaceContext } from '../contexts/WorkspaceContext'
import { WorkspaceErrorHandler } from '../components/WorkspaceErrorHandler'
import { WorkspaceLoadingStatePage } from '../pages/WorkspaceLoadingStatePage'
import { workspaceQuery } from '../api/requests/workspaceRequest'
import { useQuery } from '@tanstack/react-query'
import { workspaceIdQuery } from '../api/requests/workspaceIdRequest'

export const WorkspaceProvider = () => {
    const params = useParams<{ workspaceSlug: string }>()
    
    const { data: workspaceId, isLoading: workspaceIdLoading, error: workspaceIdError } = useQuery(workspaceIdQuery(params.workspaceSlug!))

    const workspaceQueryConfig = workspaceQuery(workspaceId)

    const { data: workspace, isLoading: workspaceLoading, error: workspaceError } = useQuery(workspaceQueryConfig)

    if (workspaceLoading || workspaceIdLoading) {
        return <WorkspaceLoadingStatePage />
    }

    const anyError = workspaceError || workspaceIdError

    if (anyError) {
        return (
            <WorkspaceErrorHandler 
                error={ anyError } 
                queryKey={ workspaceQueryConfig.queryKey } 
            />
        )
    }

    const contextValue = {
        ...workspace!,
    }

    return (
        <WorkspaceContext.Provider value={ contextValue }>
            <Outlet />
        </WorkspaceContext.Provider>
    )
}
