import { Playlist } from '@prisma/client'
import { getProperty } from '@utils/getProperty.js'

export const getModifiedPlaylistFields = (playlist: Playlist, updatedFields: Record<string, unknown>) => {
    return Object.keys(updatedFields).reduce((acc, key) => {
        if (getProperty(playlist, key as keyof typeof playlist) !== updatedFields[key]) {
            acc[key] = updatedFields[key]
        }
        return acc
    }, {} as Record<string, unknown>)
}