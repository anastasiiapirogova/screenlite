export type CreateFileUploadSessionData = {
    name: string
    path: string
    size: bigint
    mimeType: string
    workspaceId: string
    folderId: string | null
    userId: string
}