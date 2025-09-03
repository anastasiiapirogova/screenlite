import { Prisma, PrismaClient } from '@/generated/prisma/client.ts'
import { IWorkspaceRepository } from '../../domain/ports/workspace-repository.interface.ts'
import { Workspace } from '@/core/entities/workspace.entity.ts'
import { PrismaRepositoryWorkspaceMapper } from '../mappers/prisma-repository-workspace.mapper.ts'

export class PrismaWorkspaceRepository implements IWorkspaceRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

    async findById(id: string): Promise<Workspace | null> {
        const data = await this.prisma.workspace.findUnique({
            where: { id }
        })

        return data ? PrismaRepositoryWorkspaceMapper.toDomain(data) : null
    }

    async findBySlug(slug: string): Promise<Workspace | null> {
        const data = await this.prisma.workspace.findFirst({
            where: {
                slug: {
                    equals: slug,
                    mode: 'insensitive'
                }
            }
        })

        return data ? PrismaRepositoryWorkspaceMapper.toDomain(data) : null
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