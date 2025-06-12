import { createContext } from 'react'
import { PlaylistLayout } from '../types'

export const PlaylistLayoutContext = createContext<PlaylistLayout | undefined>(undefined)