import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { queryClientConfig } from './config/queryClientConfig'
import { createPortal } from 'react-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router'
import { router } from './router'

export const Router = () => {
    return (
        <RouterProvider router={ router }/>
    )
}

export const DevTools = () => {
    const container = document.body

    return createPortal(<ReactQueryDevtools initialIsOpen={ false } />, container)
}

export const App = () => {
    return (
        <StrictMode>
            <QueryClientProvider client={ queryClientConfig }>
                <Router />
                <DevTools />
            </QueryClientProvider>
        </StrictMode>
    )
}