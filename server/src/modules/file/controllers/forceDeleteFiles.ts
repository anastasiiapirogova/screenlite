import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { z } from 'zod'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { FileJobProducer } from '@/bullmq/producers/FileJobProducer.ts'

const requestSchema = z.object({
    fileIds: z.array(z.string())
})

export const forceDeleteFiles = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const result = requestSchema.safeParse(req.body)

    if (!result.success) {
        return ResponseHandler.zodError(req, res, result.error.errors)
    }

    const { fileIds: fileIdsToDelete } = result.data

    const filesToDelete = await prisma.file.findMany({
        where: {
            id: {
                in: fileIdsToDelete
            },
            workspaceId: workspace.id,
            deletedAt: {
                not: null
            }
        },
        select: {
            id: true
        }
    })

    if (!filesToDelete.length) {
        return ResponseHandler.ok(res, { forceDeletedFileIds: [] })
    }

    const fileIds = filesToDelete.map(file => file.id)

    await prisma.$transaction([
        prisma.file.updateMany({
            where: {
                id: {
                    in: fileIds
                }
            },
            data: {
                forceDeleteRequestedAt: new Date(),
                folderId: null,
                folderIdBeforeDeletion: null,
            }
        }),
        prisma.playlistItem.deleteMany({
            where: {
                fileId: {
                    in: fileIds
                }
            }
        })
    ])

    await FileJobProducer.queueFileForceDeletedJobs(fileIds)

    return ResponseHandler.ok(res, {
        forceDeletedFileIds: fileIds
    })
} 