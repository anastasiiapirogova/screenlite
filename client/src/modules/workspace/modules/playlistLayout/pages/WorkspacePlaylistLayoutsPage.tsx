import { useWorkspace } from '@/modules/workspace/hooks/useWorkspace'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense, useEffect } from 'react'
import { ListPageHeader } from '@shared/components/ListPageHeader'
import { workspacePlaylistLayoutsQuery } from '../api/queries/workspacePlaylistLayoutsQuery'
import { Link } from 'react-router'
import { useWorkspaceRoutes } from '@/modules/workspace/hooks/useWorkspaceRoutes'
import { CreatePlaylistLayoutButton } from '../components/CreatePlaylistLayoutButton'
import { InnerSidebarLayout } from '@shared/layouts/InnerSidebarLayout'
import { useSearchCountStore } from '@stores/useSearchCountStore'
import { Button } from '@shared/ui/buttons/Button'
import { WorkspacePlaylistLayoutsPageSidebar } from '../components/WorkspacePlaylistLayoutsPageSidebar'
import { useRouterPlaylistLayoutFilter } from '../hooks/useRouterPlaylistLayoutFilter'
import { useShallow } from 'zustand/react/shallow'
import { EmptyState } from '@shared/ui/EmptyState'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'

const PlaylistLayoutsList = () => {
    const routes = useWorkspaceRoutes()
    const workspace = useWorkspace()
    const { setPlaylistLayoutCount } = useSearchCountStore()
    const { filters } = useRouterPlaylistLayoutFilter()

    const { data } = useSuspenseQuery(workspacePlaylistLayoutsQuery({
        workspaceId: workspace.id,
        filters
    }))

    const { meta, data: playlistLayouts } = data

    const { total } = meta

    useEffect(() => {
        setPlaylistLayoutCount(total)
    }, [total, setPlaylistLayoutCount])

    return (
        <div>
            {
                playlistLayouts.map(
                    playlistLayout => (
                        <div key={ playlistLayout.id }>
                            <Link
                                to={ routes.playlistLayout(playlistLayout.id) }
                                className='block p-3 hover:bg-neutral-50'
                            >
                                { playlistLayout.name }
                            </Link>
                        </div>
                    )
                )
            }
        </div>
    )
}

export const WorkspacePlaylistLayoutsPage = () => {
    const { playlistLayoutCount } = useSearchCountStore(useShallow((state) => state))
    const workspace = useWorkspace()
    
    if(workspace._count.layouts === 0) {
        return (
            <LayoutBodyContainer>
                <div className='flex grow'>
                    <EmptyState
                        description='Create a layout to display your playlists.'
                        header='No layouts'
                        primaryAction={
                            <CreatePlaylistLayoutButton>
                                <Button>
                                    Create layout
                                </Button>
                            </CreatePlaylistLayoutButton>
                        }
                    />
                </div>
            </LayoutBodyContainer>
        )
    }
    
    return (
        <div className='flex flex-col grow max-w-(--breakpoint-xl) mx-auto w-full px-10 gap-5'>
            <ListPageHeader
                title='Layouts'
                count={ playlistLayoutCount }
            >
                <CreatePlaylistLayoutButton>
                    <Button variant='soft'>
                        Create layout
                    </Button>
                </CreatePlaylistLayoutButton>
            </ListPageHeader>
            <InnerSidebarLayout sidebar={ <WorkspacePlaylistLayoutsPageSidebar /> }>
                <QueryErrorResetBoundary>
                    <ErrorBoundary fallbackRender={ () => (
                        <div>
                            There was an error!
                        </div>
                    ) }
                    >
                        <Suspense fallback={ <>Loading</> }>
                            <PlaylistLayoutsList />
                        </Suspense>
                    </ErrorBoundary>
                </QueryErrorResetBoundary>
            </InnerSidebarLayout>
        </div>
    )
}
