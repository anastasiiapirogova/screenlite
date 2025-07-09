import { prisma } from '@/config/prisma.ts'
import { UpdateWorkspaceData } from '../types.ts'
import { WORKSPACE_ROLES } from '../accessControl/roles.ts'
import { Prisma } from '@/generated/prisma/client.ts'
import { CacheService } from '@/services/CacheService.ts'

export type ScreenStatusCount = { online: number, offline: number, notConnected: number }

type WorkspaceEntityCountResult = {
    membersCount: number
    playlistsCount: number
    screensCount: number
    layoutsCount: number
    filesCount: number
    trashedFilesCount: number
    userInvitationsAll: number
    userInvitationsPending: number
}

type WorkspaceEntityCount = {
    members: number
    playlists: number
    screens: number
    layouts: number
    files: number
    trashedFiles: number
    invitations: {
        all: number
        pending: number
    }
}

type ScreenStatusCountRawQueryReturn = { online: string, offline: string, notConnected: string }

export class WorkspaceRepository {
    static STATUS = {
        ACTIVE: 'active',
        DELETED: 'deleted'
    }

    static DEFAULT_STATUS = WorkspaceRepository.STATUS.ACTIVE

    static async create(name: string, slug: string, userId: string) {
        return await prisma.workspace.create({
            data: {
                name,
                slug,
                status: WorkspaceRepository.DEFAULT_STATUS,
                members: {
                    create: {
                        role: WORKSPACE_ROLES.OWNER,
                        user: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                },
                storageUsage: {
                    create: {
                        audio: 0,
                        video: 0,
                        image: 0,
                        other: 0,
                        trash: 0,
                    }
                }
            },
            include: {
                storageUsage: {
                    select: {
                        audio: true,
                        video: true,
                        image: true,
                        other: true,
                        trash: true,
                    }
                }
            }
        })
    }

    static async update(workspaceId: string, data: UpdateWorkspaceData) {
        return await prisma.workspace.update({
            where: { id: workspaceId },
            data,
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

    private static async getWorkspaceWithMember(where: Prisma.WorkspaceWhereInput, userId: string) {
        return await prisma.workspace.findFirst({
            where,
            include: {
                members: {
                    where: { userId }
                },
                storageUsage: {
                    select: {
                        audio: true,
                        video: true,
                        image: true,
                        other: true,
                    }
                }
            }
        })
    }

    static async getWithMember(workspaceId: string, userId: string) {
        return this.getWorkspaceWithMember({
            id: workspaceId
        }, userId)
    }

    static async getBySlugWithMember(slug: string, userId: string) {
        return this.getWorkspaceWithMember({
            slug: {
                equals: slug,
                mode: 'insensitive',
            }
        }, userId)
    }

    static async exists(workspaceId: string) {
        return await prisma.workspace.count({
            where: {
                id: workspaceId,
            }
        }) > 0
    }

    static async getMember(workspaceId: string, userId: string) {
        const result = await prisma.userWorkspace.findFirst({
            where: {
                workspaceId,
                userId
            }
        })

        return result || undefined
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

    static async getWithFolders(workspaceId: string, folderIds: string[]) {
        return await prisma.workspace.findUnique({
            where: {
                id: workspaceId
            },
            include: {
                folders: {
                    where: {
                        id: {
                            in: folderIds
                        }
                    }
                }
            }
        })
    }

    static async calculateStorageUsage(workspaceId: string) {
        const activeUsage = await prisma.$queryRaw<
            Array<{ type: string, total: bigint }>
        >`
            SELECT "type", SUM("size") as total
            FROM "File"
            WHERE "workspaceId" = ${workspaceId}
              AND "deletedAt" IS NULL
              AND "forceDeleteRequestedAt" IS NULL
              AND "type" IN ('video', 'image', 'audio')
            GROUP BY "type"
        `

        const trashUsage = await prisma.$queryRaw<
            Array<{ total: bigint }>
        >`
            SELECT SUM("size") as total
            FROM "File"
            WHERE "workspaceId" = ${workspaceId}
              AND "deletedAt" IS NOT NULL
              AND "forceDeleteRequestedAt" IS NULL
              AND "type" IN ('video', 'image', 'audio')
        `

        const formatUsage = (usageArr: Array<{ type: string, total: bigint }>) =>
            usageArr.reduce((acc, cur) => {
                acc[cur.type] = Number(cur.total || 0)
                return acc
            }, {} as Record<string, number>)

        return {
            active: formatUsage(activeUsage),
            trash: Number(trashUsage[0]?.total || 0),
        }
    }

    static async getEntityCounts(workspaceId: string): Promise<WorkspaceEntityCount> {
        const cacheKey = CacheService.keys.workspaceEntityCounts(workspaceId)
        const cachedResult = await CacheService.get<WorkspaceEntityCount>(cacheKey)
    
        if (cachedResult) return cachedResult
    
        const [rawCounts] = await prisma.$queryRaw<WorkspaceEntityCountResult[]>`
            SELECT
                (SELECT COUNT(*) FROM "UserWorkspace" m WHERE m."workspaceId" = w.id) AS "membersCount",
                (SELECT COUNT(*) FROM "Playlist" p WHERE p."workspaceId" = w.id) AS "playlistsCount",
                (SELECT COUNT(*) FROM "Screen" s WHERE s."workspaceId" = w.id) AS "screensCount",
                (SELECT COUNT(*) FROM "PlaylistLayout" l WHERE l."workspaceId" = w.id) AS "layoutsCount",
                (SELECT COUNT(*) FROM "File" f WHERE f."workspaceId" = w.id AND f."forceDeleteRequestedAt" IS NULL) AS "filesCount",
                (SELECT COUNT(*) FROM "File" f WHERE f."workspaceId" = w.id AND f."deletedAt" IS NOT NULL AND f."forceDeleteRequestedAt" IS NULL) AS "trashedFilesCount",
                (SELECT COUNT(*) FROM "WorkspaceUserInvitation" ui WHERE ui."workspaceId" = w.id) AS "userInvitationsAll",
                (SELECT COUNT(*) FROM "WorkspaceUserInvitation" ui WHERE ui."workspaceId" = w.id AND ui.status = 'pending') AS "userInvitationsPending"
            FROM "Workspace" w
            WHERE w.id = ${workspaceId}
        `
    
        const counts = rawCounts ?? {
            membersCount: 0,
            playlistsCount: 0,
            screensCount: 0,
            layoutsCount: 0,
            filesCount: 0,
            trashedFilesCount: 0,
            userInvitationsAll: 0,
            userInvitationsPending: 0,
        }
    
        const data: WorkspaceEntityCount = {
            members: Number(counts.membersCount),
            playlists: Number(counts.playlistsCount),
            screens: Number(counts.screensCount),
            layouts: Number(counts.layoutsCount),
            files: Number(counts.filesCount),
            trashedFiles: Number(counts.trashedFilesCount),
            invitations: {
                all: Number(counts.userInvitationsAll),
                pending: Number(counts.userInvitationsPending),
            },
        }
    
        await CacheService.set(cacheKey, data, 30)
        return data
    }
    

    static async getScreenStatusCount(workspaceId: string) {
        const cachedResult = await CacheService.get<ScreenStatusCount>(CacheService.keys.screenStatusCount(workspaceId))

        if (cachedResult) {
            return cachedResult
        }

        const screenStatusCount = await prisma.$queryRaw<ScreenStatusCountRawQueryReturn[]>`
			SELECT 
				COUNT(CASE WHEN d."onlineAt" >= NOW() - INTERVAL '2 minutes' THEN 1 END) AS "online",
				COUNT(CASE WHEN d."onlineAt" < NOW() - INTERVAL '2 minutes' THEN 1 END) AS "offline",
				COUNT(CASE WHEN d."screenId" IS NULL THEN 1 END) AS "notConnected"
			FROM "Screen" s
			LEFT JOIN "Device" d ON s."id" = d."screenId"
			WHERE s."workspaceId" = ${workspaceId}
		`

        let result: ScreenStatusCount

        if (screenStatusCount.length === 0) {
            result = { online: 0, offline: 0, notConnected: 0 }
        } else {
            result = {
                online: Number(screenStatusCount[0].online),
                offline: Number(screenStatusCount[0].offline),
                notConnected: Number(screenStatusCount[0].notConnected),
            }
        }

        await CacheService.set(CacheService.keys.screenStatusCount(workspaceId), result, 30)

        return result
    }

    static async softDelete(workspaceId: string) {
        return await prisma.workspace.update({
            where: { id: workspaceId },
            data: {
                status: WorkspaceRepository.STATUS.DELETED,
                deletedAt: new Date()
            }
        })
    }

    static async findById(id: string) {
        return prisma.workspace.findUnique({
            where: {
                id
            }
        })
    }

    static async slugExists(slug: string): Promise<boolean> {
        const count = await prisma.workspace.count({
            where: {
                slug: {
                    equals: slug,
                    mode: 'insensitive',
                },
            },
        })
        
        return count > 0
    }
}