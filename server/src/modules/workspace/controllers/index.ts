import { createWorkspace } from '@/modules/workspace/controllers/createWorkspace.ts'
import { getWorkspace } from '@/modules/workspace/controllers/getWorkspace.ts'
import { getWorkspaceEntityCounts } from '@/modules/workspace/controllers/getWorkspaceEntityCounts.ts'
import { updateWorkspace } from '@/modules/workspace/controllers/updateWorkspace.ts'
import { deleteWorkspace } from '@/modules/workspace/controllers/deleteWorkspace.ts'

export {
    createWorkspace,
    getWorkspace,
    getWorkspaceEntityCounts,
    updateWorkspace,
    deleteWorkspace,
}

export default {
    createWorkspace,
    getWorkspace,
    getWorkspaceEntityCounts,
    updateWorkspace,
    deleteWorkspace,
}