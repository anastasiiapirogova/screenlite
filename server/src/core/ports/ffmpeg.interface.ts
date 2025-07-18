export type VideoMetadata = {
    width: number
    height: number
    duration: number
    codec: string
    videoBitrate: number
    videoFrameRate: number
}

export type FFmpegServiceInterface = {
    healthCheck(): Promise<boolean>
    getVideoPreview(url: string): Promise<Buffer>
    getVideoMetadata(url: string): Promise<VideoMetadata>
    getVideoPreviewFromStorage(filePath: string): Promise<Buffer>
    getVideoMetadataFromStorage(filePath: string): Promise<VideoMetadata>
}