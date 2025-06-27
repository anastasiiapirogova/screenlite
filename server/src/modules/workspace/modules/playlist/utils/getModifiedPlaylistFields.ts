import { Playlist } from '@/generated/prisma/client.ts'
import { getProperty } from '@/utils/getProperty.ts'

export const getModifiedPlaylistFields = (playlist: Playlist, updatedFields: Record<string, unknown>) => {
    return Object.keys(updatedFields).reduce((acc, key) => {
        if (getProperty(playlist, key as keyof typeof playlist) !== updatedFields[key]) {
            acc[key] = updatedFields[key]
        }
        return acc
    }, {} as Record<string, unknown>)
}