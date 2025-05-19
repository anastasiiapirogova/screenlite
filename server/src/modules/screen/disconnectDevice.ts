import { Request, Response } from 'express'
import { prisma } from '../../config/prisma.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { screenPolicy } from './policies/screenPolicy.js'
import { ScreenRepository } from './repositories/ScreenRepository.js'
import { addSendNewStateToDeviceJob } from '@modules/device/utils/addSendNewStateToDeviceJob.js'
import { disconnectDeviceSchema } from './schemas/screenSchemas.js'

export const disconnectDevice = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = disconnectDeviceSchema.safeParse(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { screenId } = validation.data

    const screen = await ScreenRepository.findWithDevice(screenId)

    if (!screen) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await screenPolicy.canConnectDevice(user, screen)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    if (!screen.device) {
        return ResponseHandler.validationError(req, res, {
            screenId: 'NO_DEVICE_CONNECTED',
        })
    }

    const { token } = await prisma.device.update({
        where: {
            id: screen.device.id,
        },
        data: {
            screenId: null,
        },
        select: {
            token: true,
        }
    })

    addSendNewStateToDeviceJob(token)

    ResponseHandler.json(res)
}
