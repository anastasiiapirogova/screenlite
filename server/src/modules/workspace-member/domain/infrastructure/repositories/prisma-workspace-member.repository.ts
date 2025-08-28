import { IWorkspaceMemberRepository } from '@/core/ports/workspace-member-repository.interface.ts'
import { Prisma, PrismaClient, WorkspaceMember } from '@/generated/prisma/client.ts'
import { PrismaWorkspaceMemberMapper } from '../mappers/prisma-workspace-member.mapper.ts'

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
}