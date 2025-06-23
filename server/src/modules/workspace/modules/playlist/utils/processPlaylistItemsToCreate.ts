import { prisma } from '@/config/prisma.js'
import { ComparablePlaylistItem } from '@/types.js'

export const processPlaylistItemsToCreate = async (items: ComparablePlaylistItem[], workspaceId: string): Promise<ComparablePlaylistItem[]> => {
    const fileTypeItems = items.filter(item => item.fileId) as (ComparablePlaylistItem & { fileId: string })[]
    const nestedPlaylistTypeItems = items.filter(item => item.nestedPlaylistId) as (ComparablePlaylistItem & { nestedPlaylistId: string })[]

    const workspace = await prisma.workspace.findUnique({
        where: {
            id: workspaceId
        },
        select: {
            files: {
                where: {
                    id: {
                        in: fileTypeItems.map(item => item.fileId)
                    }
                },
                select: {
                    id: true
                }
            },
            playlists: {
                where: {
                    id: {
                        in: nestedPlaylistTypeItems.map(item => item.nestedPlaylistId)
                    },
                    type: 'nestable'
                },
                select: {
                    id: true
                }
            }
        },
    })

    if (!workspace) {
        throw new Error('Workspace not found')
    }

    const files = workspace.files
    const playlists = workspace.playlists

    const validFileTypeItems = fileTypeItems.filter(item => files.some(file => file.id === item.fileId))
    const validNestedPlaylistTypeItems = nestedPlaylistTypeItems.filter(item => playlists.some(playlist => playlist.id === item.nestedPlaylistId))

    return [...validFileTypeItems, ...validNestedPlaylistTypeItems]
}