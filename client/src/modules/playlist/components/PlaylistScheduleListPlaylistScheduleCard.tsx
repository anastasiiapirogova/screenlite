import { useSelectedPlaylistScheduleStore } from '@stores/useSelectedPlaylistScheduleStore'
import { PlaylistSchedule } from '../types'

export const PlaylistScheduleListPlaylistScheduleCard = ({ schedule }: { schedule: PlaylistSchedule }) => {
    const { setSchedule } = useSelectedPlaylistScheduleStore()

    const { startAt, startTime, endAt, endTime } = schedule

    return (
        <div
            className='bg-white rounded-lg p-4'
            onClick={ () => setSchedule(schedule) }
        >
            <div>
                { startAt } - { endAt }
            </div>
            <div>
                { startTime } - { endTime }
            </div>
        </div>
    )
}
