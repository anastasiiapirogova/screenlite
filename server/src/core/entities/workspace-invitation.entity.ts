import { WorkspaceInvitationDTO } from '@/shared/dto/workspace-invitation.dto.ts'
import { WorkspaceInvitationStatus } from '../enums/workspace-invitation-status.enum.ts'

export class WorkspaceInvitation {
    public readonly id: string
    public readonly email: string
    private _status: WorkspaceInvitationStatus
    public readonly workspaceId: string
    public readonly createdAt: Date

    constructor(dto: WorkspaceInvitationDTO) {
        this.id = dto.id
        this.email = dto.email
        this._status = this.normalizeStatus(dto.status)
        this.workspaceId = dto.workspaceId
        this.createdAt = dto.createdAt
    }

    get status() {
        return this._status
    }

    get isPending() {
        return this._status === WorkspaceInvitationStatus.PENDING
    }

    accept() {
        if (!this.isPending) {
            throw new Error('Only pending invitations can be accepted')
        }
          
        this._status = WorkspaceInvitationStatus.ACCEPTED
    }

    reject() {
        if (!this.isPending) {
            throw new Error('Only pending invitations can be rejected')
        }
        
        this._status = WorkspaceInvitationStatus.REJECTED
    }

    cancel() {
        if (!this.isPending) {
            throw new Error('Only pending invitations can be cancelled')
        }
        
        this._status = WorkspaceInvitationStatus.CANCELLED
    }

    private normalizeStatus(status: string): WorkspaceInvitationStatus {
        if (Object.values(WorkspaceInvitationStatus).includes(status as WorkspaceInvitationStatus)) {
            return status as WorkspaceInvitationStatus
        }
        
        return WorkspaceInvitationStatus.CANCELLED
    }
}