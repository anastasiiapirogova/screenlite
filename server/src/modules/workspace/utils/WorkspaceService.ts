import { WorkspaceStorageUsage } from '@/generated/prisma/client.ts'

export class WorkspaceService {
    // TODO: Implement job to update storage usage
    static getWorkspaceStorageUsage(workspace: { storageUsage: WorkspaceStorageUsage | null }) {
        if (!workspace.storageUsage) {
            return {
                video: 0n,
                image: 0n,
                audio: 0n,
                other: 0n,
                total: 0n
            }
        }

        const { video, image, audio, other } = workspace.storageUsage
        const total = video + image + audio + other

        return {
            video,
            image,
            audio,
            other,
            total
        }
    }
}