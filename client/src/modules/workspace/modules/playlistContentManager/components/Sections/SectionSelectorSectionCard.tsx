import { PlaylistLayoutPreview } from '@modules/workspace/modules/playlistLayout/components/PlaylistLayoutPreview'
import { PlaylistLayout, PlaylistLayoutSection } from '@modules/workspace/modules/playlistLayout/types'
import { usePlaylistContentManagerStorage } from '@stores/usePlaylistContentManagerStorage'
import { twMerge } from 'tailwind-merge'

export const SectionSelectorSectionCard = ({ section, layout }: { section: PlaylistLayoutSection, layout: PlaylistLayout }) => {
    const {
        currentLayoutSection,
        setLayoutSection
    } = usePlaylistContentManagerStorage()

    const isSelected = currentLayoutSection === section.id

    return (
        <div
            key={ section.id }
            onClick={ () => setLayoutSection(section.id) }
            className={
                twMerge(
                    'p-5 cursor-pointer',
                    isSelected ? 'bg-gray-200' : 'hover:bg-gray-100',
                )
            }
        >
            <div className='aspect-video'>
                <PlaylistLayoutPreview
                    playlistLayout={ layout }
                    highlightedSectionId={ section.id }
                />
            </div>
            { section.name }
        </div>
    )
}