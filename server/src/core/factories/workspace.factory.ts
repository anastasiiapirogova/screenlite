import { Workspace } from '@/core/entities/workspace.entity.ts'
import { WorkspaceStatus } from '@/core/enums/workspace-status.enum.ts'
import { v4 as uuid } from 'uuid'

export class WorkspaceFactory {
    static create(props: {
        name: string
        slug: string
    }): Workspace {
        const id = uuid()
        const now = new Date()
    
        return new Workspace({
            id,
            name: props.name,
            slug: props.slug,
            status: WorkspaceStatus.ACTIVE,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            picturePath: null
        })
    }
}