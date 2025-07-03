export type LinkType = 'stream' | 'website'

export type StreamType = 'rtmp' | 'hls' | 'dash'

export type StreamQuality = 'low' | 'medium' | 'high' | 'auto'

export type CreateLinkData = {
    name: string
    type: LinkType
    url: string
    width?: number
    height?: number
    defaultDuration?: number
    availabilityStartAt?: Date
    availabilityEndAt?: Date
    streamType?: StreamType
    streamQuality?: StreamQuality
    refreshInterval?: number
    workspaceId: string
    addedById: string
}