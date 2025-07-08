export type LinkType = 'stream' | 'website'

export type StreamType = 'rtmp' | 'hls' | 'dash'

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
    refreshInterval?: number
    workspaceId: string
    addedById: string
}