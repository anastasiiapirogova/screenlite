export interface WorkspaceStatistics {
    members: number
    playlists: number
    screens: number
    layouts: number
    
    files: {
        active: number
        trash: number
    }
    
    invitations: {
        total: number
        pending: number
    }
}
  
export interface IWorkspaceStatisticsQuery {
    getWorkspaceStatistics(workspaceId: string): Promise<WorkspaceStatistics>
}