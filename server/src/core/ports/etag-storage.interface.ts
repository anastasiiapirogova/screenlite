export type EtagStorage = {
    initializeUpload(uploadId: string): Promise<void>
    storeEtag(uploadId: string, partNumber: number, etag: string): Promise<void>
    getEtags(uploadId: string): Promise<Map<number, string>>
    cleanup(uploadId: string): Promise<void>
}