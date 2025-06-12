import { Request, Response } from 'express'
import { prisma } from '@config/prisma.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { addSendNewStateToDeviceJob } from '@modules/device/utils/addSendNewStateToDeviceJob.js'
import { deleteScreensSchema } from '../schemas/screenSchemas.js'

export const deleteScreens = async (req: Request, res: Response) => {
    const workspace = req.workspace!

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
            workspaceId: workspace.id
        },
        include: {
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

    await prisma.screen.deleteMany({
        where: {
            id: {
                in: screens.map(screen => screen.id)
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
        screenIds: screens.map(screen => screen.id)
    })
}
