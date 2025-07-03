import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { getFileSchema } from '../schemas/fileSchemas.ts'
import { FileRepository } from '../repositories/FileRepository.ts'

export const getFile = async (req: Request, res: Response) => {
    const workspace = req.workspace!

    const validation = await getFileSchema.safeParseAsync(req.params)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { fileId } = validation.data

    const file = await FileRepository.findById(fileId, workspace.id)

    if (!file) {
        return ResponseHandler.notFound(req, res)
    }

    return ResponseHandler.json(res, {
        file,
    })
}
