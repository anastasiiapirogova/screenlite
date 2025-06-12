import { Request, Response } from 'express'
import { prisma } from '@config/prisma.js'
import { z } from 'zod'
import { ResponseHandler } from '@utils/ResponseHandler.js'

const requestSchema = z.object({
    fileIds: z.array(z.string())
})

export const forceDeleteFiles = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    
    const result = requestSchema.safeParse(req.body)

    if (!result.success) {
        return ResponseHandler.zodError(req, res, result.error.errors)
    }

    const { fileIds } = result.data

    await prisma.file.deleteMany({
        where: {
            id: { in: fileIds },
            workspaceId: workspace.id,
            deletedAt: { not: null }
        }
    })

    return ResponseHandler.ok(res)
} 