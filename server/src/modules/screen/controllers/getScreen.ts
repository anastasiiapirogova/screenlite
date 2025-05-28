import { Request, Response } from 'express'
import { exclude } from '../../../utils/exclude.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { screenPolicy } from '../policies/screenPolicy.js'
import { ScreenRepository } from '../repositories/ScreenRepository.js'

export const getScreen = async (req: Request, res: Response) => {
    const user = req.user!
    const { id } = req.params

    const screen = await ScreenRepository.findExtended(id)

    if (!screen) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await screenPolicy.canViewScreen(user, screen)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const device = screen.device ? {
        ...screen.device,
        token: null,
        screenId: null,
        telemetry: screen.device.telemetry && screen.device.telemetry.length > 0 ? screen.device.telemetry[0] : undefined,
        status: screen.device.statusLog && screen.device.statusLog.length > 0 ? screen.device.statusLog[0] : undefined
    } : null

    ResponseHandler.json(res, {
        screen: {
            ...exclude(screen, ['device']),
            device
        }
    })
}
