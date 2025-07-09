import { Outlet, useParams } from 'react-router'
import { WorkspaceContext } from '../contexts/WorkspaceContext'
import { WorkspaceErrorHandler } from '../components/WorkspaceErrorHandler'
import { workspaceEntityCountsQuery } from '../api/queries/workspaceEntityCountsQuery'
import { WorkspaceLoadingStatePage } from '../pages/WorkspaceLoadingStatePage'
import { workspaceQuery } from '../api/requests/workspace'
import { useQuery } from '@tanstack/react-query'

export const WorkspaceProvider = () => {
    const params = useParams<{ workspaceSlug: string }>()
    const workspaceQueryConfig = workspaceQuery(params.workspaceSlug!)
    const { data: workspace, isLoading: workspaceLoading, error: workspaceError } = useQuery(workspaceQueryConfig)
    const { data: entityCounts, isLoading: countsLoading, error: countsError } = useQuery({
        ...workspaceEntityCountsQuery(workspace?.id || ''),
        enabled: !!workspace?.id
    })

    if (workspaceLoading || countsLoading) {
        return <WorkspaceLoadingStatePage />
    }

    if (workspaceError || countsError || !workspace) {
        return (
            <WorkspaceErrorHandler 
                error={ workspaceError || countsError } 
                queryKey={ workspaceQueryConfig.queryKey } 
            />
        )
    }

    return (
        <WorkspaceContext.Provider value={ { ...workspace, _count: entityCounts || { members: 0, playlists: 0, screens: 0, layouts: 0, files: 0, screenStatus: { online: 0, offline: 0, notConnected: 0 }, invitations: { all: 0, pending: 0 } } } }>
            <Outlet />
        </WorkspaceContext.Provider>
    )
}
