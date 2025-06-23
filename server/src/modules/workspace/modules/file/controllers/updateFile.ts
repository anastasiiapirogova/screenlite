import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { updateFileSchema } from '../schemas/fileSchemas.js'
import { FileRepository } from '../repositories/FileRepository.js'
import { removeUndefinedFromObject } from '@/utils/removeUndefinedFromObject.js'
import { addFileUpdatedJob } from '../utils/addFileUpdatedJob.js'

const updatePlaylists = (
    file: { id: string, availabilityStartAt: Date | null, availabilityEndAt: Date | null },
    updatedFields: { availabilityStartAt?: Date | null, availabilityEndAt?: Date | null }
) => {
    const hasAvailabilityDatesUpdated = (
        updatedFields.availabilityStartAt !== undefined &&
        updatedFields.availabilityEndAt !== undefined
    )

    if (hasAvailabilityDatesUpdated) {
        const hasAvailabilityDatesChanged = (
            file.availabilityStartAt !== updatedFields.availabilityStartAt ||
            file.availabilityEndAt !== updatedFields.availabilityEndAt
        )

        if (hasAvailabilityDatesChanged) {
            addFileUpdatedJob(file.id)
        }
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
        return ResponseHandler.notFound(req, res)
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

    updatePlaylists(file, updatedFields)

    return ResponseHandler.created(res, {
        file: updatedFile
    })
}