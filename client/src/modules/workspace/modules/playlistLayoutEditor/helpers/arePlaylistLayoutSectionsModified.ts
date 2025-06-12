import { areItemsEqual } from '@shared/helpers/areItemsEqual'
import { PlaylistLayoutEditorLayoutSection } from '../types'

type ComparablePlaylistLayoutSection = Omit<PlaylistLayoutEditorLayoutSection, 'playlistLayoutId'> 

const layoutComparableFields: (keyof ComparablePlaylistLayoutSection)[] = ['height', 'left', 'name', 'top', 'width', 'zIndex']

export const arePlaylistLayoutSectionsEqual = (a: ComparablePlaylistLayoutSection[], b: ComparablePlaylistLayoutSection[]) => {
    return areItemsEqual(a, b, layoutComparableFields)
}