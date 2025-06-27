import { prisma } from '@/config/prisma.ts'
import { AddMemberData } from '../types.ts'
import { WORKSPACE_ROLES } from '@/modules/workspace/accessControl/roles.ts'

export class MemberRepository {
    static async removeMember(workspaceId: string, userId: string) {
        return await prisma.userWorkspace.deleteMany({
            where: {
                workspaceId: workspaceId,
                userId: userId,
            },
        })
    }

    static addMemberPromise(data: AddMemberData) {
        const { workspaceId, userId, workspaceInvitationId, permissions, role } = data

        return prisma.userWorkspace.create({
            data: {
                workspaceId,
                userId,
                workspaceInvitationId,
                permissions,
                role: role ?? WORKSPACE_ROLES.MEMBER,
            },
        })
    }
}