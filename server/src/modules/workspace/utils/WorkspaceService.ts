import { WorkspaceStorageUsage } from '@/generated/prisma/client.ts'
import { CacheService } from '@/services/CacheService.ts'

export class WorkspaceService {
    // TODO: Implement job to update storage usage
    static getWorkspaceStorageUsage(workspace: { storageUsage: WorkspaceStorageUsage | null }) {
        if (!workspace.storageUsage) {
            return {
                video: 0n,
                image: 0n,
                audio: 0n,
                other: 0n,
                trash: 0n,
                total: 0n
            }
        }

        const { video, image, audio, other, trash } = workspace.storageUsage
        const total = video + image + audio + other + trash

        return {
            video,
            image,
            audio,
            other,
            trash,
            total
        }
    }

    static async invalidateWorkspaceEntityCounts(workspaceId: string) {
        await CacheService.del(CacheService.keys.workspaceEntityCounts(workspaceId))
    }
}