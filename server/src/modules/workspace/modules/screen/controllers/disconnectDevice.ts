import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.js'
import { ScreenRepository } from '../repositories/ScreenRepository.js'
import { addSendNewStateToDeviceJob } from '@/modules/device/utils/addSendNewStateToDeviceJob.js'
import { disconnectDeviceSchema } from '../schemas/screenSchemas.js'

export const disconnectDevice = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const validation = disconnectDeviceSchema.safeParse(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { screenId } = validation.data

    const screen = await ScreenRepository.findWithDevice(screenId, workspace.id)

    if (!screen) {
        return ResponseHandler.notFound(req, res)
    }

    if (!screen.device) {
        return ResponseHandler.validationError(req, res, {
            screenId: 'NO_DEVICE_CONNECTED',
        })
    }

    const { token } = await ScreenRepository.disconnectDevice(screen.device.id)

    addSendNewStateToDeviceJob(token)

    ResponseHandler.ok(res)
}
