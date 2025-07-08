import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { Button } from '@shared/ui/buttons/Button'
import { usePreviousUrlParamsStorage } from '@stores/usePreviousUrlParamsStorage'
import { TbChevronLeft } from 'react-icons/tb'
import { useNavigate } from 'react-router'

export const BackToPlaylistsButton = () => {
    const routes = useWorkspaceRoutes()
    const { urlParams } = usePreviousUrlParamsStorage()
    const navigate = useNavigate()

    return (
        <Button
            onClick={ () => navigate({
                pathname: routes.playlists,
                search: urlParams ? new URLSearchParams(urlParams).toString() : undefined
            }) }
            color='secondary'
            variant='soft'
            icon={ TbChevronLeft }
        >
            Back to playlists
        </Button>
    )
}
