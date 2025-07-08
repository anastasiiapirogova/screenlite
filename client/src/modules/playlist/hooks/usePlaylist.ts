import { useContext } from 'react'
import { PlaylistContext } from '../contexts/PlaylistContext'

function usePlaylist() {
    const context = useContext(PlaylistContext)

    if (!context) {
        throw new Error('usePlaylist must be used within a PlaylistProvider')
    }

    return context
}

export { usePlaylist }