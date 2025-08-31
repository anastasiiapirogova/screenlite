import { getWorkspaceStatisticsSqlQuery } from '@/generated/prisma/sql.ts'
import { IWorkspaceStatisticsQuery, WorkspaceStatistics } from '../../domain/ports/workspace-statistics-query.interface.ts'
import { PrismaClient } from '@/generated/prisma/client.ts'

export class PrismaWorkspaceStatisticsQuery implements IWorkspaceStatisticsQuery {
    constructor(private prisma: PrismaClient) {}
  
    async getWorkspaceStatistics(workspaceId: string): Promise<WorkspaceStatistics> {
        const [result] = await this.prisma.$queryRawTyped(getWorkspaceStatisticsSqlQuery(workspaceId))

        return {
            members: result.members ? Number(result.members) : 0,
            playlists: result.playlists ? Number(result.playlists) : 0,
            screens: result.screens ? Number(result.screens) : 0,
            layouts: result.layouts ? Number(result.layouts) : 0,
            files: {
                active: result.filesActive ? Number(result.filesActive) : 0,
                trash: result.filesTrash ? Number(result.filesTrash) : 0
            },
            invitations: {
                total: result.invitationsTotal ? Number(result.invitationsTotal) : 0,
                pending: result.invitationsPending ? Number(result.invitationsPending) : 0
            }
        }
    }
}