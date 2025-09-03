import { InitiatorDTO } from '@/shared/dto/initiator.dto.ts'

export interface WorkspaceInvitationWithDetailsView {
    invitationId: string
    email: string
    status: string
    createdAt: Date
    workspace: {
        id: string
        name: string
        slug: string
        status: string
        picturePath: string | null
    }
    initiator: InitiatorDTO
}