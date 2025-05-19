import { Request, Response } from 'express'
import { prisma } from '../../config/prisma.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { screenPolicy } from './policies/screenPolicy.js'
import { addSendNewStateToDeviceJob } from '@modules/device/utils/addSendNewStateToDeviceJob.js'
import { ScreenRepository } from './repositories/ScreenRepository.js'
import { connectDeviceSchema } from './schemas/screenSchemas.js'

export const connectDevice = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = connectDeviceSchema.safeParse(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { screenId, connectionCode } = validation.data

    const screen = await ScreenRepository.findWithDevice(screenId)

    if (!screen) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await screenPolicy.canConnectDevice(user, screen)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    if (screen.device) {
        return ResponseHandler.validationError(req, res, {
            screenId: 'SCREEN_ALREADY_HAS_A_DEVICE',
        })
    }

    const device = await prisma.device.findFirst({
        where: {
            connectionCode,
            screenId: null,
        },
    })

    if (!device) {
        return ResponseHandler.validationError(req, res, {
            connectionCode: 'DEVICE_WITH_CONNECTION_CODE_NOT_FOUND',
        })
    }

    const connectedDevice = await prisma.device.update({
        where: {
            id: device.id,
        },
        data: {
            screenId: screen.id,
        },
        include: {
            telemetry: {
                take: 1,
                orderBy: {
                    createdAt: 'desc'
                }
            },
            statusLog: {
                take: 1,
                orderBy: {
                    createdAt: 'desc'
                }
            },
        }
    })

    addSendNewStateToDeviceJob(device.token)

    ResponseHandler.json(res, {
        device: connectedDevice
    })
}