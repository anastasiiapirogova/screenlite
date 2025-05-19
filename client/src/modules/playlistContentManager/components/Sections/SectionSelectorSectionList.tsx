import { PlaylistLayout } from '@modules/playlistLayout/types'
import { SectionSelectorSectionCard } from './SectionSelectorSectionCard'

export const SectionSelectorSectionList = ({ layout }: { layout: PlaylistLayout }) => {
    return (
        <div>
            {
                layout.sections.map((section) => (
                    <SectionSelectorSectionCard
                        key={ section.id }
                        section={ section }
                        layout={ layout }
                    />
                ))
            }
        </div>
    )
}
