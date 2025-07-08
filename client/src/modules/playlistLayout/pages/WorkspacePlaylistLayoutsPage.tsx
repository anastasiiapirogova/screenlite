import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { useQuery } from '@tanstack/react-query'
import { useWorkspace } from '@/modules/workspace/hooks/useWorkspace'
import { useSearchCountStore } from '@stores/useSearchCountStore'
import { useShallow } from 'zustand/react/shallow'
import { WorkspacePlaylistLayoutsPageSidebar } from '../components/WorkspacePlaylistLayoutsPageSidebar'
import { useRouterPlaylistLayoutFilter } from '../hooks/useRouterPlaylistLayoutFilter'
import { Button } from '@shared/ui/buttons/Button'
import { CreatePlaylistLayoutButton } from '../components/CreatePlaylistLayoutButton'
import { EmptyState } from '@shared/ui/EmptyState'
import { useWorkspaceRoutes } from '@/modules/workspace/hooks/useWorkspaceRoutes'
import { useEffect } from 'react'
import type { PlaylistLayoutListItem } from '../types'
import { workspacePlaylistLayoutsQuery, type WorkspacePlaylistLayoutsRequestResponse } from '../api/requests/workspacePlaylistLayoutsRequest'
import { Link } from 'react-router'

const WorkspacePlaylistLayoutsLayoutCard = ({ layout }: { layout: PlaylistLayoutListItem }) => {
    const routes = useWorkspaceRoutes()

    return (
        <Link
            to={ routes.playlistLayout(layout.id) }
            className='block w-full hover:bg-neutral-50 p-4 rounded-xl transition-colors border border-neutral-200'
        >
            <div className='flex items-center justify-between'>
                <div className='text-xl font-medium h-10 flex items-center'>
                    { layout.name }
                </div>
                <div className='text-neutral-500 text-sm'>
                    { layout.resolutionWidth }x{ layout.resolutionHeight }
                </div>
            </div>
            <div className='flex gap-5 text-sm mt-2'>
                <div>
                    { layout._count.playlists } playlists
                </div>
            </div>
        </Link>
    )
}

const WorkspacePlaylistLayoutsPageHeader = () => {
    const { playlistLayoutCount } = useSearchCountStore()

    return (
        <div className='mb-7'>
            <div className='flex items-center justify-between'>
                <div className='text-3xl font-bold'>Layouts</div>
                <div className='flex items-center gap-2'>
                    <span className='text-neutral-500'>{ playlistLayoutCount }</span>
                    <CreatePlaylistLayoutButton>
                        <Button variant='soft'>Create layout</Button>
                    </CreatePlaylistLayoutButton>
                </div>
            </div>
        </div>
    )
}

const WorkspacePlaylistLayoutsPageList = ({ data }: { data: WorkspacePlaylistLayoutsRequestResponse }) => {
    const setPlaylistLayoutCount = useSearchCountStore(useShallow(state => state.setPlaylistLayoutCount))

    useEffect(() => {
        if (data?.meta) {
            setPlaylistLayoutCount(data.meta.total)
        }
    }, [data, setPlaylistLayoutCount])

    const { data: layouts } = data

    if (!layouts.length) {
        return <div>No layouts found</div>
    }

    return (
        <div className='flex flex-col gap-2'>
            { layouts.map((layout: PlaylistLayoutListItem) => (
                <WorkspacePlaylistLayoutsLayoutCard
                    key={ layout.id }
                    layout={ layout }
                />
            )) }
        </div>
    )
}

export const WorkspacePlaylistLayoutsPage = () => {
    const workspace = useWorkspace()
    const { filters } = useRouterPlaylistLayoutFilter()
    const { data, isLoading } = useQuery(workspacePlaylistLayoutsQuery({
        workspaceId: workspace.id,
        filters
    }))

    if (workspace._count.layouts === 0) {
        return (
            <LayoutBodyContainer>
                <div className='flex grow'>
                    <EmptyState
                        description='Create a layout to display your playlists.'
                        header='No layouts'
                        primaryAction={ (
                            <CreatePlaylistLayoutButton>
                                <Button>
                                    Create layout
                                </Button>
                            </CreatePlaylistLayoutButton>
                        ) }
                    />
                </div>
            </LayoutBodyContainer>
        )
    }

    return (
        <div className='flex gap-2 grow'>
            <div className='w-[325px] shrink-0'>
                <LayoutBodyContainer>
                    <WorkspacePlaylistLayoutsPageSidebar />
                </LayoutBodyContainer>
            </div>
            <LayoutBodyContainer>
                <ScrollArea verticalMargin={ 24 }>
                    <div className='p-7'>
                        <WorkspacePlaylistLayoutsPageHeader />
                        { isLoading || !data ? (
                            <div>Loading...</div>
                        ) : (
                            <WorkspacePlaylistLayoutsPageList data={ data } />
                        ) }
                    </div>
                </ScrollArea>
            </LayoutBodyContainer>
        </div>
    )
}
