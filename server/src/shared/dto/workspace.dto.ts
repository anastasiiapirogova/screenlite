import { WorkspaceStatus } from '@/core/enums/workspace-status.enum.ts'

export type WorkspaceDTO = {
    id: string
    name: string
    slug: string
    status: WorkspaceStatus
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    picturePath: string | null
}