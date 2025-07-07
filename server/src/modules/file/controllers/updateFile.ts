import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { updateFileSchema } from '../schemas/fileSchemas.ts'
import { FileRepository } from '../repositories/FileRepository.ts'
import { removeUndefinedFromObject } from '@/utils/removeUndefinedFromObject.ts'
import { addFileUpdatedJob } from '../utils/addFileUpdatedJob.ts'

const addFileUpdatedJobIfAvailabilityChanged = (
    file: { id: string, availabilityStartAt: Date | null, availabilityEndAt: Date | null },
    updatedFields: { availabilityStartAt?: Date | null, availabilityEndAt?: Date | null }
) => {
    const hasAvailabilityDatesChanged = (
        (updatedFields.availabilityStartAt !== undefined && file.availabilityStartAt !== updatedFields.availabilityStartAt) ||
        (updatedFields.availabilityEndAt !== undefined && file.availabilityEndAt !== updatedFields.availabilityEndAt)
    )

    if (hasAvailabilityDatesChanged) {
        addFileUpdatedJob(file.id)
    }
}

export const updateFile = async (req: Request, res: Response) => {
    const { fileId } = req.params
    const workspace = req.workspace!

    const validation = await updateFileSchema.safeParseAsync({
        ...req.body,
        fileId
    })

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { name, availabilityEndAt, availabilityStartAt, defaultDuration } = validation.data

    const file = await FileRepository.findById(fileId, workspace.id)

    if (!file) {
        return ResponseHandler.validationError(req, res, {
            fileId: 'FILE_NOT_FOUND'
        })
    }

    if (file.deletedAt) {
        return ResponseHandler.validationError(req, res, {
            fileId: 'FILE_IS_DELETED'
        })
    }

    const updatedFields = removeUndefinedFromObject({
        name,
        availabilityEndAt,
        availabilityStartAt,
        defaultDuration,
    })

    const updatedFile = await FileRepository.updateFileProperties(fileId, updatedFields)

    addFileUpdatedJobIfAvailabilityChanged(file, updatedFields)

    return ResponseHandler.created(res, {
        file: updatedFile
    })
}