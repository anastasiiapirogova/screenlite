import { Outlet, useParams } from 'react-router'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { screenQuery } from '../api/queries/screenQuery'
import { ScreenContext } from '../contexts/ScreenContext'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'

const ScreenProviderContent = () => {
    const params = useParams<{ screenId: string }>()
    const workspace = useWorkspace()

    const { data: screen } = useSuspenseQuery(screenQuery({
        screenId: params.screenId!,
        workspaceId: workspace.id
    }))

    return (
        <ScreenContext.Provider value={ screen }>
            <Outlet />
        </ScreenContext.Provider>
    )
}

export const ScreenProvider = () => {
    return (
        <QueryErrorResetBoundary>
            <ErrorBoundary fallbackRender={ () => (
                <div>
                    There was an error!
                </div>
            ) }
            >
                <Suspense fallback={ <div>loading</div> }>
                    <ScreenProviderContent />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}
