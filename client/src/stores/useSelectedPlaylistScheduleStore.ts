import { PlaylistSchedule } from '@modules/playlist/types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
	schedule: PlaylistSchedule | null
	setSchedule: (schedule: PlaylistSchedule | null) => void
}

export const useSelectedPlaylistScheduleStore = create<State>()(
    devtools(
        (set) => ({
            schedule: null,
            setSchedule: (schedule) => set({ schedule }),
        }),
        {
            name: 'selected-playlist-schedule-storage',
        },
    ),
)