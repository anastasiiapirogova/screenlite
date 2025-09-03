import { IWorkspaceMemberRepository } from '@/modules/workspace-member/domain/ports/workspace-member-repository.interface.ts'
import { Prisma, PrismaClient, WorkspaceMember } from '@/generated/prisma/client.ts'
import { PrismaWorkspaceMemberMapper } from '../mappers/prisma-workspace-member.mapper.ts'
import { WorkspaceMembershipWithWorkspaceView } from '@/modules/workspace-member/presentation/view-models/workspace-member-with-workspace.view.ts'
import { WorkspaceMemberWithUserView } from '@/modules/workspace-member/presentation/view-models/workspace-member-with-user.view.ts'
import { WorkspaceMembersQueryOptionsDTO } from '@/modules/workspace-member/domain/dto/workspace-members-query-options.dto.ts'
import { Paginator } from '@/shared/utils/pagination.util.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { WorkspaceMembershipsByUserQueryOptionsDTO } from '../../domain/dto/workspace-memberships-by-user-query-options.dto.ts'

export class PrismaWorkspaceMemberRepository implements IWorkspaceMemberRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

    async findByWorkspaceAndUser(workspaceId: string, userId: string): Promise<WorkspaceMember | null> {
        const member = await this.prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId,
                    workspaceId
                }
            }
        })

        return member ? PrismaWorkspaceMemberMapper.toDomain(member) : null
    }

    async countByWorkspace(workspaceId: string): Promise<number> {
        return this.prisma.workspaceMember.count({
            where: { workspaceId }
        })
    }

    async save(member: WorkspaceMember): Promise<void> {
        const prismaMember = PrismaWorkspaceMemberMapper.toPersistence(member)

        await this.prisma.workspaceMember.upsert({
            where: {
                id: member.id
            },
            create: prismaMember,
            update: prismaMember
        })
    }

    async delete(memberId: string): Promise<void> {
        await this.prisma.workspaceMember.delete({
            where: { id: memberId }
        })
    }

    async findWithWorkspaceByUserId(userId: string, queryOptions: WorkspaceMembershipsByUserQueryOptionsDTO): Promise<PaginationResponse<WorkspaceMembershipWithWorkspaceView>> {
        const { pagination } = queryOptions || {}

        const where: Prisma.WorkspaceMemberWhereInput = {}

        where.userId = userId

        const findManyFn = (skip: number, take: number) => {
            return this.prisma.workspaceMember.findMany({
                where: {
                    userId
                },
                include: {
                    workspace: true
                },
                skip,
                take
            })
        }
        
        const countFn = () => this.prisma.workspaceMember.count({ where })

        const result = await Paginator.paginate(
            findManyFn,
            countFn,
            pagination
        )

        return {
            items: result.items.map((member) => ({
                membershipId: member.id,
                workspace: {
                    id: member.workspace.id,
                    name: member.workspace.name,
                    slug: member.workspace.slug,
                    picturePath: member.workspace.picturePath
                }
            })),
            meta: result.meta,
        }
    }

    async countByWorkspaceAndUser(workspaceId: string, userId: string): Promise<number> {
        return this.prisma.workspaceMember.count({
            where: {
                workspaceId,
                userId
            }
        })
    }

    async findByWorkspace(queryOptions: WorkspaceMembersQueryOptionsDTO): Promise<PaginationResponse<WorkspaceMemberWithUserView>> {
        const { filters, pagination } = queryOptions
        const { workspaceId, name, email } = filters

        const where: Prisma.WorkspaceMemberWhereInput = {
            workspaceId
        }

        if (name || email) {
            where.user = {}
            if (name) {
                where.user.name = {
                    contains: name,
                    mode: 'insensitive'
                }
            }
            if (email) {
                where.user.email = {
                    contains: email,
                    mode: 'insensitive'
                }
            }
        }

        const findManyFn = (skip: number, take: number) => {
            return this.prisma.workspaceMember.findMany({
                where,
                include: {
                    user: true
                },
                skip,
                take,
                orderBy: {
                    user: {
                        name: 'asc'
                    }
                }
            })
        }

        const countFn = () => this.prisma.workspaceMember.count({ where })

        const result = await Paginator.paginate(
            findManyFn,
            countFn,
            pagination
        )

        return {
            items: result.items.map((member) => ({
                membershipId: member.id,
                user: {
                    id: member.user.id,
                    email: member.user.email,
                    name: member.user.name,
                    profilePhotoPath: member.user.profilePhotoPath
                }
            })),
            meta: result.meta,
        }
    }
}