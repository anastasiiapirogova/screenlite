import { useEffect } from 'react'
import { usePlaylistLayout } from '@modules/playlistLayout/hooks/usePlaylistLayout'
import { NewSectionData, usePlaylistLayoutEditorStorage } from '@stores/usePlaylistLayoutEditorStorage'
import { Button } from '@shared/ui/buttons/Button'
import { TbPlus } from 'react-icons/tb'
import { Accordion } from 'radix-ui'
import { PlaylistLayoutSortableSectionCard } from './PlaylistLayoutSectionCard'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

export const PlaylistLayoutSectionsList = () => {
    const playlistLayout = usePlaylistLayout()

    const newSection: NewSectionData = {
        name: 'New section',
        top: 0,
        left: 0,
        width: playlistLayout.resolutionWidth,
        height: playlistLayout.resolutionHeight,
    }

    const { sections, initStorage, addSection } = usePlaylistLayoutEditorStorage()
    
    useEffect(() => {
        if(!sections) {
            const resolution = {
                width: playlistLayout.resolutionWidth,
                height: playlistLayout.resolutionHeight
            }

            initStorage([...playlistLayout.sections], { ...resolution }, { ...playlistLayout })
        }
    }, [sections, initStorage, playlistLayout])

    if(!sections) return null

    const sortedSections = sections.sort((a, b) => b.zIndex - a.zIndex)

    return (
        <SortableContext 
            items={ sections }
            strategy={ verticalListSortingStrategy }
        >
            <div>
                <div className='flex justify-between items-center'>
                    <div className='text-lg font-semibold'>
                        Sections
                    </div>
                    <div>
                        <Button
                            onClick={ () => addSection(newSection) }
                            variant='soft'
                            size='squareSmall'
                            icon={ TbPlus }
                        />
                    </div>
                </div>
                <div className='mt-5'>
                    <Accordion.Root
                        className='flex flex-col gap-2'
                        type="single"
                        collapsible
                    >
                        {
                            sortedSections.map(section => (
                                <PlaylistLayoutSortableSectionCard
                                    key={ section.id }
                                    section={ section }
                                />
                            ))
                        }
                    </Accordion.Root>
                </div>
            </div>
        </SortableContext>
    )
}
