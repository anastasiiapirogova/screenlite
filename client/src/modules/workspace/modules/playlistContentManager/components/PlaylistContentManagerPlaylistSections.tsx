import { usePlaylist } from '@modules/workspace/modules/playlist/hooks/usePlaylist'
import { usePlaylistContentManagerStorage } from '@stores/usePlaylistContentManagerStorage'
import { useEffect } from 'react'
import { SectionSelectorSectionList } from './Sections/SectionSelectorSectionList'

export const PlaylistContentManagerPlaylistSections = () => {
    const {
        setLayoutSection
    } = usePlaylistContentManagerStorage()

    const { layout } = usePlaylist()

    useEffect(() => {
        if (layout && layout.sections.length > 0) {
            setLayoutSection(layout.sections[0].id)
        }
    }, [layout, setLayoutSection])

    if (!layout) return null

    return <SectionSelectorSectionList layout={ layout } />
}
