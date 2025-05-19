import { PlaylistScheduleListPlaylistScheduleCard } from '../components/PlaylistScheduleListPlaylistScheduleCard'
import { usePlaylist } from '../hooks/usePlaylist'
import { PlaylistSchedule } from '../types'
import { AddPlaylistScheduleButton } from '../components/buttons/AddPlaylistScheduleButton'
import { useSelectedPlaylistScheduleStore } from '@stores/useSelectedPlaylistScheduleStore'
import { useEffect } from 'react'
import { Button } from '@shared/ui/buttons/Button'
import { PlaylistSchedulesEmptyState } from '../components/PlaylistSchedulesEmptyState'

const ScheduleList = ({ schedules }: { schedules: PlaylistSchedule[] }) => {
    const { setSchedule } = useSelectedPlaylistScheduleStore()

    useEffect(() => {
        return () => {
            setSchedule(null)
        }
    }, [setSchedule])

    return (
        <>
            { schedules.map((schedule) => (
                <PlaylistScheduleListPlaylistScheduleCard
                    key={ schedule.id }
                    schedule={ schedule }
                />
            )) }
        </>
    )
}

export const WorkspacePlaylistSchedulesPage = () => {
    const { schedules } = usePlaylist()
    const { schedule, setSchedule } = useSelectedPlaylistScheduleStore()

    return (
        <div className='flex grow w-full px-5'>
            <div className='w-full max-w-(--breakpoint-md)'>
                <div className='flex items-center justify-end'>
                    <AddPlaylistScheduleButton>
                        <Button variant="soft">
                            Add schedule
                        </Button>
                    </AddPlaylistScheduleButton>
                </div>
                <div className='grid grid-cols-2 gap-5'>
                    { schedules.length > 0 ? (
                        <ScheduleList schedules={ schedules } />
                    ) : (
                        <PlaylistSchedulesEmptyState />
                    ) }
                    { schedule && (
                        <div>
                            <div onClick={ () => setSchedule(null) }>
                                Close
                            </div>
                            { schedule?.id }
                        </div>
                    ) }
                </div>
            </div>
            
        </div>
    )
}
