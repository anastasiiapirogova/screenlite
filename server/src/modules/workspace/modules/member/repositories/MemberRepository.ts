import { prisma } from '@config/prisma.js'
import { AddMemberData } from '../types.js'

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
                role: role ?? 'member',
            },
        })
    }
}