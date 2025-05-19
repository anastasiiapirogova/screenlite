import { PlaylistType } from '../types'

export const playlistTypes: PlaylistType[] = ['standard', 'nestable']

const playlistTypeNames: { [key in PlaylistType]: string } = {
    standard: 'Standard',
    nestable: 'Nestable'
}

export const getPlaylistTypeName = (type: PlaylistType) => {
    return playlistTypeNames[type] || 'Standard'
}

export const getPlaylistTypeOptions = () => {
    return playlistTypes.map(type => ({
        value: type,
        label: getPlaylistTypeName(type)
    }))
}