import { prisma } from '@config/prisma.js'
import { CreateScreenData } from '../types.js'

export class ScreenRepository {
    static async findExtended(id: string) {
        return await prisma.screen.findUnique({
            where: {
                id: id,
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

    static async findWithDevice(id: string) {
        return prisma.screen.findUnique({
            where: {
                id,
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

    static async findPlaylists(id: string) {
        return await prisma.playlist.findMany({
            where: {
                screens: {
                    some: {
                        screenId: id,
                    },
                },
                deletedAt: null
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
}