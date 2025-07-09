import { createContext } from 'react'
import { ScreenliteConfig } from '../types'

export const ConfigContext = createContext<ScreenliteConfig | undefined>(undefined)