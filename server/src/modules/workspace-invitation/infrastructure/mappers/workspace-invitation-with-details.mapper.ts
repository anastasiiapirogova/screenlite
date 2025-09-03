import { WorkspaceInvitationWithDetailsView } from '@/modules/workspace-invitation/presentation/view-models/workspace-invitation-with-details.view.ts'
import { InitiatorType } from '@/core/enums/initiator-type.enum.ts'
import { Prisma } from '@/generated/prisma/client.ts'

export class WorkspaceInvitationWithDetailsMapper {
    static toView(
        prismaInvitation: Prisma.WorkspaceInvitationGetPayload<{
            include: {
                workspace: { select: { id: true, name: true, slug: true, status: true, picturePath: true } }
                initiator: { select: { id: true, type: true, userId: true, user: true } }
            }
        }>
    ): WorkspaceInvitationWithDetailsView {
        return {
            invitationId: prismaInvitation.id,
            email: prismaInvitation.email,
            status: prismaInvitation.status,
            createdAt: prismaInvitation.createdAt,
            workspace: {
                id: prismaInvitation.workspace.id,
                name: prismaInvitation.workspace.name,
                slug: prismaInvitation.workspace.slug,
                status: prismaInvitation.workspace.status,
                picturePath: prismaInvitation.workspace.picturePath
            },
            initiator: {
                id: prismaInvitation.initiator.id,
                type: prismaInvitation.initiator.type as InitiatorType,
                userId: prismaInvitation.initiator.userId
            }
        }
    }
}