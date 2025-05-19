import { Outlet, useParams } from 'react-router'
import { WorkspaceContext } from '../contexts/WorkspaceContext'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { workspaceQuery } from '../api/queries/workspaceQuery'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { WorkspaceErrorHandler } from '../components/WorkspaceErrorHandler'
import { FileUploader } from '@modules/file/components/FileUploader'
import { workspaceEntityCountsQuery } from '../api/queries/workspaceEntityCountsQuery'

const WorkspaceProviderContent = () => {
    const params = useParams<{ workspaceSlug: string }>()

    const { data: workspace } = useSuspenseQuery(workspaceQuery(params.workspaceSlug!))

    const { data: entityCounts } = useSuspenseQuery(workspaceEntityCountsQuery(params.workspaceSlug!))

    return (
        <WorkspaceContext.Provider value={ { ...workspace, _count: entityCounts } }>
            <FileUploader />
            <Outlet />
        </WorkspaceContext.Provider>
    )
}

export const WorkspaceProvider = () => {
    return (
        <QueryErrorResetBoundary>
            <ErrorBoundary fallbackRender={ ({ error }) => <WorkspaceErrorHandler error={ error }/> }>
                <Suspense fallback={ <div>loading</div> }>
                    <WorkspaceProviderContent />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}
