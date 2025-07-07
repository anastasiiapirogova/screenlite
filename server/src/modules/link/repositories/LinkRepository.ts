import { prisma } from '@/config/prisma.ts'
import { Link } from '@/generated/prisma/client.ts'
import { CreateLinkData } from '../types.ts'

export class LinkRepository {
    static async findManyByIds(linkIds: string[], workspaceId: string) {
        return prisma.link.findMany({
            where: {
                id: { in: linkIds },
                workspaceId,
                deletedAt: null
            }
        })
    }

    static async findActiveLinksByIds(linkIds: string[], workspaceId: string) {
        return prisma.link.findMany({
            where: {
                id: { in: linkIds },
                workspaceId,
                deletedAt: null
            }
        })
    }

    static async getLink(linkId: string) {
        return prisma.link.findUnique({
            where: { id: linkId },
        })
    }

    static async getLinkWithoutRelationsById(linkId: string) {
        return prisma.link.findUnique({
            where: { id: linkId }
        })
    }

    static async create(data: CreateLinkData) {
        return prisma.link.create({
            data
        })
    }

    static async update(linkId: string, data: Partial<Link>) {
        return prisma.link.update({
            where: { id: linkId },
            data
        })
    }

    static async delete(linkId: string) {
        return prisma.link.update({
            where: { id: linkId },
            data: { deletedAt: new Date() }
        })
    }

    static async findManyByWorkspaceId(workspaceId: string) {
        return prisma.link.findMany({
            where: {
                workspaceId,
                deletedAt: null
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }
} 