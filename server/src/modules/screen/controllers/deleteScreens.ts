import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { DeviceJobProducer } from '@/bullmq/producers/DeviceJobProducer.ts'
import { deleteScreensSchema } from '../schemas/screenSchemas.ts'

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
        return ResponseHandler.notFound(req, res)
    }

    await prisma.screen.deleteMany({
        where: {
            id: {
                in: screens.map(screen => screen.id)
            }
        }
    })

    const jobs = screens
        .map(screen => screen.device?.token)
        .filter((token): token is string => !!token)
        .map(token => DeviceJobProducer.queueSendNewStateToDeviceJob(token))

    await Promise.all(jobs)

    ResponseHandler.json(res, {
        screenIds: screens.map(screen => screen.id)
    })
}
