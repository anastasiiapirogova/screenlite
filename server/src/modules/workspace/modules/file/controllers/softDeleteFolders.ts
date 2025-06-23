import { Request, Response } from 'express'
import { deleteFoldersSchema } from '../schemas/folderSchemas.js'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { FolderRepository } from '../repositories/FolderRepository.js'
import { prisma } from '@/config/prisma.js'
import { Prisma } from '@/generated/prisma/client.js'

export const softDeleteFolders = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const validation = await deleteFoldersSchema.safeParseAsync(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { folderIds } = validation.data

    const foldersToDelete = await FolderRepository.findActiveFoldersByIds(folderIds, workspace.id)
    
    if (!foldersToDelete.length) {
        return ResponseHandler.ok(res)
    }

    const workspaceIds = new Set(foldersToDelete.map(folder => folder.workspaceId))

    if (workspaceIds.size !== 1) {
        return ResponseHandler.validationError(req, res, {
            folderIds: 'FOLDERS_MUST_BELONG_TO_SAME_WORKSPACE'
        })
    }

    const allSubfolderPromises = folderIds.map(id => FolderRepository.findFolderSubtreeById(id))

    const allSubfolders = await Promise.all(allSubfolderPromises)
    
    const subfolderIds = [...new Set(allSubfolders.flat().map(folder => folder.id))]
    
    const allFolderIds = [...folderIds, ...subfolderIds]
    
    const files = await prisma.file.findMany({
        where: {
            folderId: {
                in: allFolderIds
            },
            workspaceId: workspace.id,
            deletedAt: null
        },
        select: {
            id: true
        }
    })

    const fileIds = files.map(file => file.id)

    try {
        await prisma.$transaction(async (tx) => {
            const now = new Date()

            await tx.$executeRaw`
                UPDATE "Folder"
                SET "parentIdBeforeDeletion" = "parentId",
                    "parentId" = NULL,
                    "deletedAt" = ${now}
                WHERE "id" IN (${Prisma.join(folderIds)})
            `

            if (subfolderIds.length > 0) {
                await tx.folder.updateMany({
                    where: {
                        id: {
                            in: subfolderIds
                        }
                    },
                    data: {
                        deletedAt: now
                    }
                })
            }

            if (fileIds.length > 0) {
                await tx.file.updateMany({
                    where: {
                        id: {
                            in: fileIds
                        }
                    },
                    data: {
                        deletedAt: now
                    }
                })
            }
        })

        return ResponseHandler.ok(res)
    } catch (error) {
        console.error('Error during folders deletion:', error)
        return ResponseHandler.serverError(req, res)
    }
}