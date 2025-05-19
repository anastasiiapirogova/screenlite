import { Request, Response } from 'express'
import { ResponseHandler } from '@utils/ResponseHandler.js'
import { WorkspacePolicy } from './policies/WorkspacePolicy.js'
import { WorkspaceRepository } from './repositories/WorkspaceRepository.js'
import { prisma } from '@config/prisma.js'

// TODO: Maybe hide some of the counts if the user has no access to them?
export const getWorkspaceEntityCounts = async (req: Request, res: Response) => {
    const user = req.user!
    const { slug } = req.params

    const workspace = await prisma.workspace.findFirst({
        where: {
            slug: {
                equals: slug,
                mode: 'insensitive',
            },
        },
        select: {
            id: true,
            members: {
                where: {
                    user: {
                        id: user.id,
                    },
                }
            },
            _count: {
                select: {
                    members: true,
                    playlists: true,
                    screens: true,
                    layouts: true,
                    files: true,
                }
            }
        }
    })

    if (!workspace) {
        return ResponseHandler.notFound(res)
    }

    const allowed = await WorkspacePolicy.canViewWorkspace(user, workspace)

    if (!allowed) {
        return ResponseHandler.forbidden(res)
    }

    const screenStatusCount = await WorkspaceRepository.getScreenStatusCount(workspace.id)

    return ResponseHandler.json(res, {
        workspaceEntityCounts: {
            ...workspace._count,
            screenStatus: screenStatusCount,
        }
    })
}
