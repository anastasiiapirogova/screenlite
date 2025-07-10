import { Request, Response } from 'express'
import { exclude, excludeFromArray } from '@/utils/exclude.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { PlaylistLayoutRepository } from '../repositories/PlaylistLayoutRepository.ts'
import { updatePlaylistLayoutSchema } from '../schemas/playlistLayoutSchemas.ts'
import { removeUndefinedFromObject } from '@/utils/removeUndefinedFromObject.ts'
import { PlaylistLayoutSection } from '@/generated/prisma/client.ts'
import { prisma } from '@/config/prisma.ts'
import { PlaylistJobProducer } from '@/bullmq/producers/PlaylistJobProducer.ts'

type SectionData = Omit<PlaylistLayoutSection, 'playlistLayoutId'>

const doesUpdateAffectScreens = (updateAndDeleteCount: number, sectionsToUpdate: Partial<SectionData>[]) => {
    if(updateAndDeleteCount > 0) {
        return true
    }

    return sectionsToUpdate.some(section => Object.keys(section).some(key => key !== 'name'))
}

export const updatePlaylistLayout = async (req: Request, res: Response) => {
    const validation = await updatePlaylistLayoutSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const {
        playlistLayoutId,
        name,
        resolutionHeight,
        resolutionWidth,
        sections
    } = validation.data

    const playlistLayout = await PlaylistLayoutRepository.getWithSections(playlistLayoutId)

    if (!playlistLayout) {
        return ResponseHandler.notFound(req, res)
    }

    const updatedData = removeUndefinedFromObject({
        name,
        resolutionHeight: resolutionHeight ? playlistLayout.resolutionHeight !== resolutionHeight ? resolutionHeight : undefined : undefined,
        resolutionWidth: resolutionWidth ? playlistLayout.resolutionWidth !== resolutionWidth ? resolutionWidth : undefined : undefined,
        sections
    })

    const sectionsToCreate: SectionData[] = []
    const sectionsToUpdate: Partial<SectionData>[] = []
    const sectionsToDelete: SectionData[] = []

    if (updatedData.sections) {
        const existingSections = playlistLayout.sections

        sectionsToCreate.push(...updatedData.sections.filter((section: SectionData) => {
            return !existingSections.some((currentSection: SectionData) => currentSection.id === section.id)
        }))

        sectionsToUpdate.push(...updatedData.sections.filter((section: SectionData) => {
            const existingSection = existingSections.find((currentSection: SectionData) => currentSection.id === section.id)

            if (!existingSection) {
                return false
            }

            return Object.keys(section).some(key => section[key as keyof SectionData] !== existingSection[key as keyof SectionData])
        }))

        sectionsToDelete.push(...existingSections.filter((section: SectionData) => {
            return !updatedData.sections.some((updatedSection: SectionData) => updatedSection.id === section.id)
        }))
    }

    const updatedLayout = await prisma.playlistLayout.update({
        where: {
            id: playlistLayoutId
        },
        include: {
            sections: true
        },
        data: {
            ...exclude(updatedData, ['sections']),
            sections: {
                deleteMany: {
                    id: {
                        in: sectionsToDelete.map(section => section.id)
                    }
                },
                create: excludeFromArray(sectionsToCreate, ['id']),
                updateMany: sectionsToUpdate.map(section => ({
                    where: { id: section.id },
                    data: exclude(section, ['id']),
                })),
            },
        },
    })

    const layoutResolutionChanged = updatedData.resolutionHeight || updatedData.resolutionWidth

    if(layoutResolutionChanged || doesUpdateAffectScreens(sectionsToDelete.length + sectionsToCreate.length, sectionsToUpdate)) {
        const playlists = await prisma.playlist.findMany({
            where: {
                playlistLayoutId,
                deletedAt: null,
                isPublished: true
            },
            select: {
                id: true
            }
        })

        await PlaylistJobProducer.queuePlaylistUpdatedJobs(playlists.map(playlist => playlist.id), 'playlist layout updated')
    }

    ResponseHandler.json(res, {
        playlistLayout: updatedLayout
    })
}
