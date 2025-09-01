import { IWorkspaceMemberRepository } from '@/core/ports/workspace-member-repository.interface.ts'
import { Prisma, PrismaClient, WorkspaceMember } from '@/generated/prisma/client.ts'
import { PrismaWorkspaceMemberMapper } from '../mappers/prisma-workspace-member.mapper.ts'
import { WorkspaceMembershipWithWorkspaceView } from '@/modules/user/presentation/view-models/workspace-member-with-workspace.view.ts'
import { UserWorkspacesQueryOptionsDTO } from '@/modules/user/domain/dto/user-workspaces-query-options.dto.ts'
import { Paginator } from '@/shared/utils/pagination.util.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'

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

    async findWithWorkspaceByUserId(userId: string, queryOptions: UserWorkspacesQueryOptionsDTO): Promise<PaginationResponse<WorkspaceMembershipWithWorkspaceView>> {
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
}