import { Prisma, PrismaClient } from '@/generated/prisma/client.ts'
import { IWorkspaceInvitationRepository } from '../../domain/ports/workspace-invitation-repository.interface.ts'
import { WorkspaceInvitation } from '@/core/entities/workspace-invitation.entity.ts'
import { WorkspaceInvitationsQueryOptionsDTO } from '../../domain/dto/workspace-invitations-query-options.dto.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { Paginator } from '@/shared/utils/pagination.util.ts'
import { WorkspaceInvitation as PrismaWorkspaceInvitation } from '@/generated/prisma/client.ts'
import { PrismaWorkspaceInvitationMapper } from '../mappers/prisma-workspace-invitation.mapper.ts'
import { WorkspaceInvitationStatus } from '@/core/enums/workspace-invitation-status.enum.ts'

export class PrismaWorkspaceInvitationRepository implements IWorkspaceInvitationRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

    async save(invitation: WorkspaceInvitation): Promise<void> {
        const invitationData = this.toPersistence(invitation)

        const where: Prisma.WorkspaceInvitationUpsertArgs['where'] = {
            id: invitationData.id,
        }

        await this.prisma.workspaceInvitation.upsert({
            where,
            create: invitationData,
            update: {
                ...invitationData,
            },
        })
    }

    async findById(id: string): Promise<WorkspaceInvitation | null> {
        const invitation = await this.prisma.workspaceInvitation.findUnique({
            where: { id },
        })

        return invitation ? this.toDomain(invitation) : null
    }

    async findAll(queryOptions: WorkspaceInvitationsQueryOptionsDTO): Promise<PaginationResponse<WorkspaceInvitation>> {
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

        if (filters?.workspaceId) {
            where.workspaceId = filters.workspaceId
        }

        const findManyFn = (skip: number, take: number) => this.prisma.workspaceInvitation.findMany({ where, skip, take })
        
        const countFn = () => this.prisma.workspaceInvitation.count({ where })

        const result = await Paginator.paginate(
            findManyFn,
            countFn,
            pagination
        )

        return {
            items: result.items.map(this.toDomain),
            meta: result.meta,
        }
    }

    async countByWorkspaceIdEmailAndStatus(workspaceId: string, email: string, status: WorkspaceInvitationStatus[]): Promise<number> {
        return this.prisma.workspaceInvitation.count({
            where: {
                workspaceId,
                email: {
                    equals: email,
                    mode: 'insensitive',
                },
                status: {
                    in: status,
                },
            },
        })
    }

    private toDomain(prismaInvitation: PrismaWorkspaceInvitation): WorkspaceInvitation {
        return PrismaWorkspaceInvitationMapper.toDomain(prismaInvitation)
    }

    private toPersistence(invitation: WorkspaceInvitation): Omit<PrismaWorkspaceInvitation, 'updatedAt'> {
        return PrismaWorkspaceInvitationMapper.toPersistence(invitation)
    }
}