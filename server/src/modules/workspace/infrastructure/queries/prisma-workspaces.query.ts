import { Prisma, PrismaClient } from '@/generated/prisma/client.ts'
import { WorkspacesQueryOptionsDTO } from '../../domain/dto/workspaces-query-options.dto.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { Workspace } from '@/core/entities/workspace.entity.ts'
import { Paginator } from '@/shared/utils/pagination.util.ts'
import { PrismaRepositoryWorkspaceMapper } from '../mappers/prisma-repository-workspace.mapper.ts'
import { IWorkspacesQuery } from '../../domain/ports/workspaces-query.interface.ts'

export class PrismaWorkspacesQuery implements IWorkspacesQuery {
    constructor(private prisma: PrismaClient) {}

    async handle(queryOptions: WorkspacesQueryOptionsDTO): Promise<PaginationResponse<Workspace>> {
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

        if (filters?.status) {
            where.status = {
                in: filters.status,
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
}