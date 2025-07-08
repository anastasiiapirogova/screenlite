import { createContext } from 'react'
import { Playlist, PlaylistSchedule } from '../types'

type PlaylistContextType = Playlist & {
	schedules: PlaylistSchedule[]
} | undefined

export const PlaylistContext = createContext<PlaylistContextType>(undefined)