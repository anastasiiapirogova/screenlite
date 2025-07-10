import { Request, Response } from 'express'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { DeviceJobProducer } from '@/bullmq/producers/DeviceJobProducer.ts'
import { ScreenRepository } from '../repositories/ScreenRepository.ts'
import { connectDeviceSchema } from '../schemas/screenSchemas.ts'
import { DeviceRepository } from '@/modules/device/repositories/DeviceRepository.ts'

// TODO: Implement brute-force protection (e.g. rate limit by IP or screenId, track failed attempts, and temporarily block after multiple failures)
export const connectDevice = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const { screenId } = req.params

    const validation = connectDeviceSchema.safeParse({
        ...req.body,
        screenId
    })

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { connectionCode } = validation.data

    const screen = await ScreenRepository.findWithDevice(screenId, workspace.id)

    if (!screen) {
        return ResponseHandler.notFound(req, res)
    }

    if (screen.device) {
        return ResponseHandler.validationError(req, res, {
            screenId: 'SCREEN_ALREADY_HAS_A_DEVICE',
        })
    }

    const device = await DeviceRepository.findByConnectionCode(connectionCode)
 
    if (!device || device.screenId) {
        return ResponseHandler.validationError(req, res, {
            connectionCode: 'DEVICE_WITH_CONNECTION_CODE_NOT_FOUND',
        })
    }

    const connectedDevice = await DeviceRepository.connectScreen(device.id, screen.id)

    await DeviceJobProducer.queueSendNewStateToDeviceJob(device.token)

    ResponseHandler.json(res, {
        device: connectedDevice
    })
}