import { prisma } from '@config/prisma.js'
import { CreateUserInvitationData } from '../types.js'
import { Prisma } from 'generated/prisma/client.js'

export class WorkspaceUserInvitationRepository {
    static STATUS = {
        PENDING: 'pending',
        ACCEPTED: 'accepted',
        DELETED: 'deleted',
        CANCELLED: 'cancelled',
    }

    static async create(data: CreateUserInvitationData) {
        return await prisma.workspaceUserInvitation.create({
            data: {
                ...data,
                status: WorkspaceUserInvitationRepository.STATUS.PENDING,
            },
        })
    }

    static async find(id: string) {
        return await prisma.workspaceUserInvitation.findUnique({
            where: {
                id: id,
            },
        })
    }

    static async findPendingInvitationsByEmail(email: string, workspaceId?: string) {
        return await prisma.workspaceUserInvitation.findMany({
            where: {
                email: email,
                workspaceId: workspaceId ?? Prisma.skip,
                status: WorkspaceUserInvitationRepository.STATUS.PENDING,
                workspace: {
                    deletedAt: null
                }
            },
            include: {
                invitor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profilePhoto: true,
                    },
                }
            }
        })
    }

    static async hasPendingInvitation(email: string, workspaceId: string) {
        return await prisma.workspaceUserInvitation.count({
            where: {
                email: email,
                workspaceId,
                status: WorkspaceUserInvitationRepository.STATUS.PENDING,
            },
        }) > 0
    }

    static async cancelInvitation(id: string) {
        return await prisma.workspaceUserInvitation.update({
            where: {
                id: id,
            },
            data: {
                status: WorkspaceUserInvitationRepository.STATUS.CANCELLED,
            },
        })
    }

    static async deleteInvitation(id: string) {
        return await prisma.workspaceUserInvitation.update({
            where: {
                id: id,
            },
            data: {
                status: WorkspaceUserInvitationRepository.STATUS.DELETED,
            },
        })
    }

    static acceptInvitationPromise(id: string) {
        return prisma.workspaceUserInvitation.update({
            where: {
                id: id,
            },
            data: {
                status: WorkspaceUserInvitationRepository.STATUS.ACCEPTED,
            },
        })
    }
    
    static async isUserWorkspaceMember(workspaceId: string, userId: string) {
        return await prisma.userWorkspace.count({
            where: {
                workspaceId: workspaceId,
                userId: userId,
            },
        }) > 0
    }
}