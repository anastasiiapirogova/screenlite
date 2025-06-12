import { useRouterPlaylistFilter } from '@modules/workspace/modules/playlist/hooks/useRouterPlaylistFilter'
import { Input } from '@shared/ui/input/Input'

export const PlaylistSearchRouterFilter = () => {
    const { search, setFilter } = useRouterPlaylistFilter()

    return (
        <Input
            value={ search }
            onChange={ (e) => setFilter('search', e.target.value) }
            placeholder="Search playlists..."
        />
    )
}