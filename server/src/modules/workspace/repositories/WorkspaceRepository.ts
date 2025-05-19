import { prisma } from '@config/prisma.js'
import { getRedisClient, redisKeys } from '@config/redis.js'
import { WorkspaceUserInvitationPolicy } from '@modules/workspaceUserInvitation/policies/WorkspaceUserInvitationPolicy.js'

export type ScreenStatusCount = { online: number, offline: number, notConnected: number }

export class WorkspaceRepository {
    static STATUS = {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
    }

    static DEFAULT_STATUS = WorkspaceRepository.STATUS.ACTIVE

    static PERMISSIONS = {
        ...WorkspaceUserInvitationPolicy.PERMISSIONS,
    }

    static async create(name: string, slug: string, userId: string) {
        await prisma.workspace.create({
            data: {
                name,
                slug,
                status: WorkspaceRepository.DEFAULT_STATUS,
                members: {
                    create: {
                        user: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                }
            },
        })
    }

    static async findBySlug(slug: string) {
        return await prisma.workspace.findFirst({
            where: {
                slug: {
                    equals: slug,
                    mode: 'insensitive'
                }
            }
        })
    }

    static async exists(workspaceId: string) {
        return await prisma.workspace.count({
            where: {
                id: workspaceId,
            }
        }) > 0
    }

    static async getWithMember(workspaceId: string, userId: string) {
        return await prisma.workspace.findUnique({
            where: {
                id: workspaceId,
            },
            include: {
                members: {
                    where: {
                        user: {
                            id: userId,
                        },
                    }
                }
            }
        })
    }

    static async getWithFolder(workspaceId: string, folderId?: string | null) {
        return await prisma.workspace.findUnique({
            where: {
                id: workspaceId,
            },
            include: {
                ...(folderId ? {
                    folders: {
                        where: {
                            id: folderId,
                        }
                    }
                } : {})
            }
        })
    }

    static async getScreenStatusCount(workspaceId: string) {
        const redis = getRedisClient()

        const cacheKey = redisKeys.screenStatusCount(workspaceId)

        const cachedResult = await redis.get(cacheKey)

        if (cachedResult) {
            return JSON.parse(cachedResult) as ScreenStatusCount
        }

        const screenStatusCount = await prisma.$queryRaw<ScreenStatusCount[]>`
            SELECT 
                COUNT(CASE WHEN d."isOnline" = true THEN 1 END) AS "online",
                COUNT(CASE WHEN d."isOnline" = false THEN 1 END) AS "offline",
                COUNT(CASE WHEN d."screenId" IS NULL THEN 1 END) AS "notConnected"
            FROM "Screen" s
            LEFT JOIN "Device" d ON s."id" = d."screenId"
            WHERE s."workspaceId" = ${workspaceId}
        `

        const result = screenStatusCount.length === 0 ? { online: 0, offline: 0, notConnected: 0 } : screenStatusCount[0]

        redis.setex(cacheKey, 30, JSON.stringify(result))

        return result
    }
}