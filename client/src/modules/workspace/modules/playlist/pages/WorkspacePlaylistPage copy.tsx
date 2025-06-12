import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { usePlaylist } from '../hooks/usePlaylist'
import { prettySize } from '@shared/helpers/prettySize'
import { twMerge } from 'tailwind-merge'
import { EntityPageCard } from '@shared/components/EntityPageCard'
import pluralize from 'pluralize'
import { SwitchPlaylistStatusButton } from '../components/buttons/SwitchPlaylistStatusButton'
import { PlaylistPageLayoutCard } from '../components/cards/PlaylistPageLayoutCard'
import { PlaylistPagePriorityCard } from '../components/cards/PlaylistPagePriorityCard'
import { getPlaylistTypeName } from '../utils/playlistTypes'

const ParentPlaylists = () => {
    const routes = useWorkspaceRoutes()
    const { _count, id } = usePlaylist()

    const parentPlaylistCount = _count.parentPlaylists

    return (
        <EntityPageCard
            title="Used in"
            actionName='Show'
            to={ routes.playlistContentManager(id) }
        >
            <div className='flex gap-2 justify-between min-h-16 items-center'>
                <div>
                    { pluralize('playlist', parentPlaylistCount, true) }
                </div>
            </div>
        </EntityPageCard>
    )
}


const Items = () => {
    const routes = useWorkspaceRoutes()
    const { size, _count, id } = usePlaylist()

    const itemCount = _count.items

    return (
        <EntityPageCard
            title="Content"
            actionName='Manage content'
            to={ routes.playlistContentManager(id) }
            warning={ itemCount === 0 }
        >
            <div className='flex gap-2 text-3xl justify-between min-h-16 grow items-center'>
                <div>
                    { pluralize('item', itemCount, true) }
                </div>
                <div className='text-neutral-400'>
                    { prettySize(size) }
                </div>
            </div>
        </EntityPageCard>
    )
}

const Schedules = () => {
    const routes = useWorkspaceRoutes()
    const { schedules, id } = usePlaylist()

    const scheduleCount = schedules.length

    return (
        <EntityPageCard
            title="Schedules"
            warning={ scheduleCount === 0 }
            to={ routes.playlistSchedules(id) }
            actionName='Manage schedules'
        >
            <div className={
                twMerge(
                    'flex h-16 items-center',
                )
            }
            >
                {
                    scheduleCount
                }
            </div>
        </EntityPageCard>
    )
}

const Status = () => {
    const { isPublished } = usePlaylist()

    return (
        <EntityPageCard title="Status">
            <div className={
                twMerge(
                    'flex h-16 items-center',
                    isPublished ? 'text-blue-500' : 'text-neutral-500'
                )
            }
            >
                {
                    isPublished ? 'Published' : 'Draft'
                }
            </div>
            <div>
                <SwitchPlaylistStatusButton />
            </div>
        </EntityPageCard>
    )
}

const Type = () => {
    const { type } = usePlaylist()

    return (
        <EntityPageCard title="Type">
            <div className={
                twMerge(
                    'text-4xl',
                    'flex h-16 items-center',
                    'text-neutral-500'
                )
            }
            >
                {
                    getPlaylistTypeName(type)
                }
            </div>
            <div className='opacity-0 text-neutral-300 group-hover:opacity-100 transition-opacity select-none'>
                Playlist type cannot be changed
            </div>
        </EntityPageCard>
    )
}

const Screens = () => {
    const { _count: count, id } = usePlaylist()
    const routes = useWorkspaceRoutes()
    const screenCount = count.screens

    return (
        <EntityPageCard
            title="Screens"
            to={ routes.playlistScreens(id) }
            actionName='Manage screens'
            warning={ screenCount === 0 }
        >
            <div className={
                twMerge(
                    'text-4xl',
                    'flex h-16 items-center',
                )
            }
            >
                {
                    screenCount
                }
            </div>
           
        </EntityPageCard>
    )
}

const Description = () => {
    const { description } = usePlaylist()

    if(!description) return null

    return (
        <EntityPageCard title="Description">
            <div className='text-neutral-700 mt-2'>
                {
                    description
                }
            </div>
        </EntityPageCard>
    )
}

export const WorkspacePlaylistPage = () => {
    const { type } = usePlaylist()

    const isNestable = type === 'nestable'

    if(isNestable) {
        return (
            <div className='flex flex-col gap-10'>
                <div className='grid grid-cols-3 gap-5'>
                    <Status />
                    <Type />
                    <ParentPlaylists />
                </div>
                <Description />
                <div className='grid grid-cols-2 gap-5'>
                    <PlaylistPageLayoutCard />
                    <Items />
                </div>
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-10'>
            <div className='grid grid-cols-3 gap-5'>
                <Status />
                <Type />
                <PlaylistPagePriorityCard />
            </div>
            <Description />
            <div className='grid grid-cols-2 gap-5'>
                <PlaylistPageLayoutCard />
                <Items />
                <Schedules />
                <Screens />
            </div>
        </div>
    )
}
