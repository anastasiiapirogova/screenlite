import { Request, Response } from 'express'
import { exclude } from '@utils/exclude.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { ScreenRepository } from '../repositories/ScreenRepository.js'

export const screen = async (req: Request, res: Response) => {
    const workspace = req.workspace!
    const { screenId } = req.params

    const screen = await ScreenRepository.findExtended(screenId, workspace.id)

    if (!screen) {
        return ResponseHandler.notFound(res)
    }

    const device = screen.device ? {
        ...screen.device,
        token: null,
        screenId: null,
        telemetry: screen.device.telemetry && screen.device.telemetry.length > 0 ? screen.device.telemetry[0] : undefined,
        status: screen.device.statusLog && screen.device.statusLog.length > 0 ? screen.device.statusLog[0] : undefined
    } : null

    return ResponseHandler.json(res, {
        screen: {
            ...exclude(screen, ['device']),
            device
        }
    })
}
