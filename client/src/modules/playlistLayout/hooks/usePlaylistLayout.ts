import { useContext } from 'react'
import { PlaylistLayoutContext } from '../contexts/PlaylistLayoutContext'

function usePlaylistLayout() {
    const context = useContext(PlaylistLayoutContext)

    if (!context) {
        throw new Error('usePlaylistLayout must be used within a PlaylistLayoutProvider')
    }

    return context
}

export { usePlaylistLayout }