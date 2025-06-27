import { prisma } from '@/config/prisma.ts'
import { CreateScreenData } from '../types.ts'

export class ScreenRepository {
    static async findExtended(id: string, workspaceId?: string) {
        return await prisma.screen.findUnique({
            where: {
                id: id,
                ...(workspaceId && { workspaceId })
            },
            include: {
                device: {
                    include: {
                        telemetry: {
                            take: 1,
                            orderBy: {
                                createdAt: 'desc'
                            }
                        },
                        statusLog: {
                            take: 1,
                            orderBy: {
                                createdAt: 'desc'
                            }
                        },
                    }
                },
                _count: {
                    select: {
                        playlists: {
                            where: {
                                playlist: {
                                    deletedAt: null
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    static async create(data: CreateScreenData) {
        return await prisma.screen.create({
            data: {
                ...data,
                resolutionWidth: 1920,
                resolutionHeight: 1080,
            },
        })
    }

    static async find(id: string) {
        return await prisma.screen.findUnique({
            where: {
                id: id,
            }
        })
    }

    static async findWithDevice(id: string, workspaceId?: string) {
        return prisma.screen.findUnique({
            where: {
                id,
                ...(workspaceId && { workspaceId })
            },
            include: {
                device: {
                    select: {
                        id: true
                    }
                }
            }
        })
    }

    static async findPlaylists(id: string, workspaceId?: string) {
        return await prisma.playlist.findMany({
            where: {
                screens: {
                    some: {
                        screenId: id,
                    },
                },
                deletedAt: null,
                ...(workspaceId && { workspaceId })
            },
        })
    }

    static async findWorkspaceId(id: string) {
        const result = await prisma.screen.findUnique({
            where: {
                id: id,
            },
            select: {
                workspaceId: true,
            }
        })

        return result?.workspaceId
    }

    static async findManyByIdsAndWorkspaceId(screenIds: string[], workspaceId: string) {
        return await prisma.screen.findMany({
            where: {
                id: {
                    in: screenIds
                },
                workspaceId: workspaceId
            },
            select: {
                id: true,
                device: {
                    select: {
                        token: true
                    }
                }
            }
        })
    }

    static async disconnectDevice(id: string) {
        return await prisma.device.update({
            where: { id },
            data: { screenId: null },
        })
    }
}