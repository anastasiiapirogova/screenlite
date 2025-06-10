import { prisma } from '@config/prisma.js'
import { getRedisClient, redisKeys } from '@config/redis.js'
import { UpdateWorkspaceData } from '../types.js'
import { WORKSPACE_ROLES } from '../constants/permissions.js'

export type ScreenStatusCount = { online: number, offline: number, notConnected: number }

type WorkspaceWithCounts = {
	membersCount: number
	playlistsCount: number
	screensCount: number
	layoutsCount: number
	filesCount: number
	userInvitationsAll: number
	userInvitationsPending: number
};

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
                }
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

    static async findBySlugWithMember(slug: string, userId: string) {
        return await prisma.workspace.findFirst({
            where: {
                slug: {
                    equals: slug,
                    mode: 'insensitive',
                },
            },
            include: {
                members: {
                    where: {
                        userId
                    }
                },
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
        return await prisma.workspace.findFirst({
            where: {
                id: workspaceId
            },
            include: {
                members: {
                    where: {
                        userId
                    }
                }
            }
        })
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

    static async getEntityCounts(workspaceId: string) {
        const workspaceEntityCounts: WorkspaceWithCounts[] = await prisma.$queryRaw`
			SELECT
				(
					SELECT COUNT(*) FROM "UserWorkspace" m WHERE m."workspaceId" = w.id
				) AS "membersCount",
				(
					SELECT COUNT(*) FROM "Playlist" p WHERE p."workspaceId" = w.id
				) AS "playlistsCount",
				(
					SELECT COUNT(*) FROM "Screen" s WHERE s."workspaceId" = w.id
				) AS "screensCount",
				(
					SELECT COUNT(*) FROM "PlaylistLayout" l WHERE l."workspaceId" = w.id
				) AS "layoutsCount",
				(
					SELECT COUNT(*) FROM "File" f WHERE f."workspaceId" = w.id
				) AS "filesCount",
				(
					SELECT COUNT(*) FROM "WorkspaceUserInvitation" ui WHERE ui."workspaceId" = w.id
				) AS "userInvitationsAll",
				(
					SELECT COUNT(*) FROM "WorkspaceUserInvitation" ui WHERE ui."workspaceId" = w.id AND ui.status = 'pending'
				) AS "userInvitationsPending"
			FROM "Workspace" w
			WHERE w.id = ${workspaceId}
		`

        const counts = workspaceEntityCounts[0] || {
            membersCount: 0,
            playlistsCount: 0,
            screensCount: 0,
            layoutsCount: 0,
            filesCount: 0,
            userInvitationsAll: 0,
            userInvitationsPending: 0,
        }

        return {
            members: Number(counts.membersCount),
            playlists: Number(counts.playlistsCount),
            screens: Number(counts.screensCount),
            layouts: Number(counts.layoutsCount),
            files: Number(counts.filesCount),
            invitations: {
                all: Number(counts.userInvitationsAll),
                pending: Number(counts.userInvitationsPending),
            },
        }
    }

    static async getScreenStatusCount(workspaceId: string) {
        const redis = getRedisClient()

        const cacheKey = redisKeys.screenStatusCount(workspaceId)

        const cachedResult = await redis.get(cacheKey)

        if (cachedResult) {
            const parsed = JSON.parse(cachedResult)

            return {
                online: Number(parsed.online),
                offline: Number(parsed.offline),
                notConnected: Number(parsed.notConnected),
            } as ScreenStatusCount
        }

        const screenStatusCount = await prisma.$queryRaw<ScreenStatusCountRawQueryReturn[]>`
			SELECT 
				COUNT(CASE WHEN d."isOnline" = true THEN 1 END) AS "online",
				COUNT(CASE WHEN d."isOnline" = false THEN 1 END) AS "offline",
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

        redis.setex(cacheKey, 30, JSON.stringify(result))

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
}