import { Outlet, useParams } from 'react-router'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { screenQuery } from '../api/queries/screenQuery'
import { ScreenContext } from '../contexts/ScreenContext'

const ScreenProviderContent = () => {
    const params = useParams<{ screenId: string }>()

    const { data: screen } = useSuspenseQuery(screenQuery(params.screenId!))

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
