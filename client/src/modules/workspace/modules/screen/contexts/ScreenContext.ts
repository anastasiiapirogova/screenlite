import { createContext } from 'react'
import { Screen } from '../types'

export const ScreenContext = createContext<Screen | undefined>(undefined)