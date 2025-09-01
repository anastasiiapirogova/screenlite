import { v4 as uuid } from 'uuid'
import { WorkspaceInvitationStatus } from '../enums/workspace-invitation-status.enum.ts'
import { WorkspaceInvitation } from '../entities/workspace-invitation.entity.ts'

export class WorkspaceInvitationFactory {
    static create(props: {
        workspaceId: string
        email: string
        status: WorkspaceInvitationStatus
    }): WorkspaceInvitation {
        const id = uuid()
        const now = new Date()
    
        return new WorkspaceInvitation({
            id,
            email: props.email,
            status: props.status,
            workspaceId: props.workspaceId,
            createdAt: now,
        })
    }
}