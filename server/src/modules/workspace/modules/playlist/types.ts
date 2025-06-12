export type CreatePlaylistData = {
    name: string
    workspaceId: string
    type: 'standard' | 'nestable'
}

export enum PlaylistStatus {
    published = 'published',
    draft = 'draft',
    deleted = 'deleted',
}

export type PlaylistItemType = 'file' | 'nested_playlist'
