import { useContext } from 'react'
import { WorkspaceWithEntityCounts } from '../types'
import { WorkspaceContext } from '../contexts/WorkspaceContext'

function useWorkspace(safe?: false): WorkspaceWithEntityCounts
function useWorkspace(safe?: true): WorkspaceWithEntityCounts | undefined

function useWorkspace(safe: boolean = false) {
    const context = useContext(WorkspaceContext)

    if (!context && !safe) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider')
    }

    return context
}

export { useWorkspace }