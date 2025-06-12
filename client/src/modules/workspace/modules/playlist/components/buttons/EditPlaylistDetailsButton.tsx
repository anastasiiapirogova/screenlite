import { ButtonElement } from '@/types.js'
import { usePlaylist } from '@modules/workspace/modules/playlist/hooks/usePlaylist'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { cloneElement } from 'react'
import { useNavigate } from 'react-router'

type Props = {
	children: ButtonElement
}

export const EditPlaylistDetailsButton = ({ children }: Props) => {
    const routes = useWorkspaceRoutes()
    const navigate = useNavigate()
    const { id } = usePlaylist()

    return cloneElement(children, {
        onClick: () => navigate(routes.playlistEditDetails(id)),
    })
}