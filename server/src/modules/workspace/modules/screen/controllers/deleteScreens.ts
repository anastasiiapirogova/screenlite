import { Request, Response } from 'express'
import { prisma } from '@/config/prisma.ts'
import { ResponseHandler } from '@/utils/ResponseHandler.ts'
import { addSendNewStateToDeviceJob } from '@/modules/device/utils/addSendNewStateToDeviceJob.ts'
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
