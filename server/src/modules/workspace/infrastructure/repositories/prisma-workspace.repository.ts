import { Prisma, PrismaClient } from '@/generated/prisma/client.ts'
import { IWorkspaceRepository } from '../../domain/ports/workspace-repository.interface.ts'
import { Workspace } from '@/core/entities/workspace.entity.ts'
import { PrismaRepositoryWorkspaceMapper } from '../mappers/prisma-repository-workspace.mapper.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { WorkspacesQueryOptionsDTO } from '../../domain/dto/workspaces-query-options.dto.ts'
import { Paginator } from '@/shared/utils/pagination.util.ts'

export class PrismaWorkspaceRepository implements IWorkspaceRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

    async findById(id: string): Promise<Workspace | null> {
        const data = await this.prisma.workspace.findUnique({
            where: { id }
        })

        return data ? PrismaRepositoryWorkspaceMapper.toDomain(data) : null
    }

    async findBySlug(slug: string): Promise<Workspace | null> {
        const data = await this.prisma.workspace.findUnique({
            where: { slug }
        })

        return data ? PrismaRepositoryWorkspaceMapper.toDomain(data) : null
    }

    async findAll(queryOptions?: WorkspacesQueryOptionsDTO): Promise<PaginationResponse<Workspace>> {

        const { filters, pagination } = queryOptions || {}

        const where: Prisma.WorkspaceWhereInput = {
            deletedAt: null
        }

        if (filters?.name) {
            where.name = {
                contains: filters.name,
                mode: 'insensitive'
            }
        }

        if (filters?.slug) {
            where.slug = {
                equals: filters.slug,
                mode: 'insensitive'
            }
        }

        const findManyFn = (skip: number, take: number) => this.prisma.workspace.findMany({ where, skip, take })

        const countFn = () => this.prisma.workspace.count({ where })

        const result = await Paginator.paginate(
            findManyFn,
            countFn,
            pagination
        )

        return {
            items: result.items.map(PrismaRepositoryWorkspaceMapper.toDomain),
            meta: result.meta,
        }
    }

    async save(workspace: Workspace): Promise<void> {
        const data = PrismaRepositoryWorkspaceMapper.toPersistence(workspace)

        await this.prisma.workspace.upsert({
            where: { id: workspace.id },
            create: data,
            update: data
        })
    }

    async delete(id: string): Promise<void> {
        await this.prisma.workspace.delete({
            where: { id }
        })
    }
}