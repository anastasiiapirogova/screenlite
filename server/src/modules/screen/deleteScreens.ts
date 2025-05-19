import { Request, Response } from 'express'
import { prisma } from '../../config/prisma.js'
import { asyncFilter } from '../../utils/asyncFilter.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { screenPolicy } from './policies/screenPolicy.js'
import { addSendNewStateToDeviceJob } from '@modules/device/utils/addSendNewStateToDeviceJob.js'
import { deleteScreensSchema } from './schemas/screenSchemas.js'

export const deleteScreens = async (req: Request, res: Response) => {
    const user = req.user!

    const validation = deleteScreensSchema.safeParse(req.body)

    if (!validation.success) {
        return ResponseHandler.zodError(req, res, validation.error.errors)
    }

    const { screenIds } = validation.data

    const screens = await prisma.screen.findMany({
        where: {
            id: {
                in: screenIds
            },
        },
        include: {
            workspace: {
                include: {
                    members: {
                        where: {
                            user: {
                                id: user.id,
                            },
                        }
                    }
                }
            },
            device: {
                select: {
                    token: true,
                }
            }
        },
    })

    if (!screens.length) {
        return ResponseHandler.notFound(res)
    }

    const allowedScreens = await asyncFilter(screens, async (screen) => {
        return await screenPolicy.canDeleteScreenEager(user, screen.workspace)
    })

    if (allowedScreens.length === 0) {
        return ResponseHandler.forbidden(res)
    }

    const allowedScreenIds = allowedScreens.map(screen => screen.id)

    await prisma.screen.deleteMany({
        where: {
            id: {
                in: allowedScreenIds
            }
        }
    })

    screens.forEach(screen => {
        const token = screen.device?.token

        if (token) {
            addSendNewStateToDeviceJob(token)
        }
    })

    ResponseHandler.json(res, {
        screenIds: allowedScreenIds
    })
}
