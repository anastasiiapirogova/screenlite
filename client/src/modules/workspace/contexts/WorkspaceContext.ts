import { createContext } from 'react'
import { WorkspaceWithEntityCounts } from '../types'

export const WorkspaceContext = createContext<WorkspaceWithEntityCounts | undefined>(undefined)