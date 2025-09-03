import { Prisma, PrismaClient } from '@/generated/prisma/client.ts'
import { IWorkspaceInvitationsWithWorkspaceQuery } from '../../domain/ports/workspace-invitations-with-workspace-query.interface.ts'
import { GlobalWorkspaceInvitationsQueryOptionsDTO } from '../../domain/dto/global-workspace-invitations-query-options.dto.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { Paginator } from '@/shared/utils/pagination.util.ts'
import { WorkspaceInvitationWithDetailsView } from '../../presentation/view-models/workspace-invitation-with-details.view.ts'
import { WorkspaceInvitationWithDetailsMapper } from '../mappers/workspace-invitation-with-details.mapper.ts'

export class PrismaWorkspaceInvitationsWithWorkspaceQuery implements IWorkspaceInvitationsWithWorkspaceQuery {
    constructor(private prisma: PrismaClient) {}

    async getWorkspaceInvitationsWithWorkspace(queryOptions: GlobalWorkspaceInvitationsQueryOptionsDTO): Promise<PaginationResponse<WorkspaceInvitationWithDetailsView>> {
        const { filters, pagination } = queryOptions

        const where: Prisma.WorkspaceInvitationWhereInput = {}

        if (filters?.email) {
            where.email = {
                equals: filters.email,
                mode: 'insensitive',
            }
        }

        if (filters?.status) {
            where.status = {
                in: filters.status,
            }
        }

        if (filters?.workspaceStatus) {
            where.workspace = {
                status: {
                    in: filters.workspaceStatus,
                }
            }
        }

        if (filters?.workspaceId) {
            where.workspaceId = filters.workspaceId
        }
        
        const findManyFn = (skip: number, take: number) => this.prisma.workspaceInvitation.findMany({
            where,
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                workspace: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        status: true,
                        picturePath: true
                    }
                },
                initiator: {
                    select: {
                        id: true,
                        type: true,
                        userId: true,
                        user: true
                    }
                }
            }
        })
        
        const countFn = () => this.prisma.workspaceInvitation.count({ where })

        const result = await Paginator.paginate(
            findManyFn,
            countFn,
            pagination
        )

        return {
            items: result.items.map((invitation) => WorkspaceInvitationWithDetailsMapper.toView(invitation)),
            meta: result.meta,
        }
    }
}