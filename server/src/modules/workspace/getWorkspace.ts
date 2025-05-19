import { Request, Response } from 'express'
import { prisma } from '../../config/prisma.js'
import { exclude } from '../../utils/exclude.js'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { WorkspacePolicy } from './policies/WorkspacePolicy.js'

export const getWorkspace = async (req: Request, res: Response) => {
    const user = req.user!
    const { slug } = req.params

    const workspace = await prisma.workspace.findFirst({
        where: {
            slug: {
                equals: slug,
                mode: 'insensitive',
            },
        },
        include: {
            members: {
                where: {
                    user: {
                        id: user.id,
                    },
                }
            },
        }
    })

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await WorkspacePolicy.canViewWorkspace(user, workspace)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    return ResponseHandler.json(res, {
        workspace: {
            ...exclude(workspace, ['members']),
        }
    })
}
