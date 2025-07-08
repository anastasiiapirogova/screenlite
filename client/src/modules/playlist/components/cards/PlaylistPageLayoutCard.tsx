import { usePlaylist } from '@modules/playlist/hooks/usePlaylist.js'
import { ChangePlaylistLayoutButton } from '../buttons/ChangePlaylistLayoutButton.js'
import { EntityPageCard } from '@shared/components/EntityPageCard'
import { prettyResolution } from '@shared/helpers/prettyResolution'
import pluralize from 'pluralize'

const LayoutIsNotSet = () => {
    return (
        <ChangePlaylistLayoutButton>
            <EntityPageCard
                title="Layout"
                actionName='Set layout'
            >
                <div className='flex gap-2 text-3xl justify-between min-h-16 items-center'>
                    <div>
                        Not set
                    </div>
                </div>
            </EntityPageCard>
        </ChangePlaylistLayoutButton>
    )
}

export const PlaylistPageLayoutCard = () => {
    const { layout } = usePlaylist()

    if(!layout) {
        return <LayoutIsNotSet />
    }

    const sectionCount = layout.sections.length

    const resolution = {
        width: layout.resolutionWidth,
        height: layout.resolutionHeight
    }

    return (
        <ChangePlaylistLayoutButton>
            <EntityPageCard
                title="Layout"
                actionName='Change layout'
            >
                <div>
                    <div className='flex gap-2 text-3xl justify-between min-h-16 grow items-center'>
                        <div>
                            { layout.name }
                        </div>
                        <div className='text-lg text-right text-neutral-500'>
                            <div>
                                { prettyResolution(resolution) }
                            </div>
                            <div>
                                { pluralize('section', sectionCount, true) }
                            </div>
                        </div>
                    </div>
                </div>
            </EntityPageCard>
        </ChangePlaylistLayoutButton>
    )
}