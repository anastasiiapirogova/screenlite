import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { usePlaylistContentManagerStorage } from '@stores/usePlaylistContentManagerStorage'
import { PlaylistSectionSortableItemCard } from './PlaylistSectionItemCard'

export function SectionItemList() {
    const { currentLayoutSectionItems } = usePlaylistContentManagerStorage()

    const items = currentLayoutSectionItems

    if(items === null) return null

    return (
        <SortableContext 
            items={ items }
            strategy={ verticalListSortingStrategy }
        >
            <div className='divide-y'>
                { items.length === 0 && <div className='p-10'>No items</div> }
                { items.map((item) => (
                    <PlaylistSectionSortableItemCard
                        key={ item.id }
                        item={ item }
                    />
                )) }
            </div>
        </SortableContext>
    )
}