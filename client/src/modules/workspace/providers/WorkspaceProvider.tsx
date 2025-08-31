import { Outlet, useParams } from 'react-router'
import { WorkspaceContext } from '../contexts/WorkspaceContext'
import { WorkspaceErrorHandler } from '../components/WorkspaceErrorHandler'
import { WorkspaceLoadingStatePage } from '../pages/WorkspaceLoadingStatePage'
import { workspaceQuery } from '../api/requests/workspaceRequest'
import { useQuery } from '@tanstack/react-query'
import { workspaceIdQuery } from '../api/requests/workspaceIdRequest'
import { workspaceStatisticsQuery } from '../api/requests/workspaceStatisticsRequest'

export const WorkspaceProvider = () => {
    const params = useParams<{ workspaceSlug: string }>()
    
    const { data: workspaceId, isLoading: workspaceIdLoading, error: workspaceIdError } = useQuery(workspaceIdQuery(params.workspaceSlug!))

    const workspaceQueryConfig = workspaceQuery(workspaceId)

    const { data: workspace, isLoading: workspaceLoading, error: workspaceError } = useQuery(workspaceQueryConfig)

    const workspaceStatisticsQueryConfig = workspaceStatisticsQuery(workspaceId)

    const { data: workspaceStatistics, isLoading: workspaceStatisticsLoading, error: workspaceStatisticsError } = useQuery(workspaceStatisticsQueryConfig)

    if (workspaceLoading || workspaceIdLoading || workspaceStatisticsLoading) {
        return <WorkspaceLoadingStatePage />
    }

    const anyError = workspaceError || workspaceIdError || workspaceStatisticsError

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
        statistics: workspaceStatistics!
    }

    return (
        <WorkspaceContext.Provider value={ contextValue }>
            <Outlet />
        </WorkspaceContext.Provider>
    )
}
