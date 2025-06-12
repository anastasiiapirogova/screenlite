import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { prisma } from '@config/prisma.js'
import { PlaylistCopyService } from '../PlaylistCopyService.js'
import { PlaylistRepository } from '../../repositories/PlaylistRepository.js'
import { beforeEach } from 'node:test'
import { Weekday } from '@generated/prisma/client.js'

const WORKSPACE_ID = 'workspace-playlist-copy'

describe('PlaylistCopyService', () => {
    beforeAll(async () => {
        await prisma.workspace.upsert({
            where: { id: WORKSPACE_ID },
            update: {},
            create: { id: WORKSPACE_ID, name: 'Test Workspace', slug: WORKSPACE_ID, status: 'ACTIVE' },
        })
    })

    beforeEach(async () => {
        await prisma.playlist.deleteMany({
            where: {
                workspaceId: WORKSPACE_ID,
            }
        })
    })

    afterAll(async () => {
        await prisma.workspace.delete({
            where: { id: WORKSPACE_ID },
        })
        await prisma.$disconnect()
    })

    it('should copy playlist with all its relations', async () => {
        const playlistLayout = await prisma.playlistLayout.create({
            data: {
                name: 'Test Playlist Layout',
                workspaceId: WORKSPACE_ID,
                resolutionWidth: 1920,
                resolutionHeight: 1080,
                sections: {
                    create: [
                        {
                            id: 'test-section-1',
                            name: 'Test Playlist Layout Section',
                            top: 0,
                            left: 0,
                            width: 1920,
                            height: 1080,
                            zIndex: 1,
                        }
                    ]
                }
            }
        })

        await prisma.screen.createMany({
            data: [
                {
                    id: 'test-screen-1',
                    workspaceId: WORKSPACE_ID,
                    name: 'Test Screen 1',
                    resolutionWidth: 1920,
                    resolutionHeight: 1080,
                    type: 'screen',
                },
                {
                    id: 'test-screen-2',    
                    workspaceId: WORKSPACE_ID,
                    name: 'Test Screen 2',
                    resolutionWidth: 1920,
                    resolutionHeight: 1080,
                    type: 'screen',
                }
            ]
        })
        
        const playlist = await prisma.playlist.create({
            data: {
                name: 'Test Playlist',
                type: PlaylistRepository.TYPE.STANDARD,
                workspaceId: WORKSPACE_ID,
                isPublished: true,
                playlistLayoutId: playlistLayout.id,
                items: {
                    create: [
                        {
                            type: 'file',
                            order: 1,
                            duration: 10,
                            playlistLayoutSectionId: 'test-section-1'
                        },
                        {
                            type: 'file',
                            order: 2,
                            duration: 20,
                            playlistLayoutSectionId: 'test-section-1'
                        }
                    ]
                },
                screens: {
                    create: [
                        { screenId: 'test-screen-1' },
                        { screenId: 'test-screen-2' }
                    ]
                },
                schedules: {
                    create: [
                        {
                            startAt: new Date(),
                            endAt: new Date(),
                            startTime: '09:00',
                            endTime: '17:00',
                            weekdays: [Weekday.MONDAY, Weekday.TUESDAY, Weekday.WEDNESDAY, Weekday.THURSDAY, Weekday.FRIDAY]
                        }
                    ]
                }
            },
            include: {
                items: true,
                screens: {
                    select: {
                        screenId: true
                    }
                },
                schedules: true
            }
        })

        const copiedPlaylist = await PlaylistCopyService.copyPlaylist(playlist)

        expect(copiedPlaylist).toBeDefined()
        expect(copiedPlaylist.id).not.toBe(playlist.id)
        expect(copiedPlaylist.name).toBe(playlist.name)
        expect(copiedPlaylist.type).toBe(playlist.type)
        expect(copiedPlaylist.workspaceId).toBe(playlist.workspaceId)
        expect(copiedPlaylist.isPublished).toBe(false)

        const copiedPlaylistWithRelations = await prisma.playlist.findUnique({
            where: { id: copiedPlaylist.id },
            include: {
                items: true,
                screens: true,
                schedules: true
            }
        })

        if(!copiedPlaylistWithRelations) {
            throw new Error('Copied playlist not found')
        }

        expect(copiedPlaylistWithRelations.items).toHaveLength(2)
        expect(copiedPlaylistWithRelations.screens).toHaveLength(2)
        expect(copiedPlaylistWithRelations.schedules).toHaveLength(1)

        await prisma.playlist.delete({ where: { id: playlist.id } })
        await prisma.playlist.delete({ where: { id: copiedPlaylist.id } })
    })
}) 