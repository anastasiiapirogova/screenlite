import { ReactElement, useState } from 'react'
import { CreatePlaylistModal } from '../modals/CreatePlaylistModal'
import { Modal } from '@shared/ui/modal/Modal'

type Props = {
	children: ReactElement
}

export const CreatePlaylistButton = ({ children }: Props) => {
    const [open, setOpen] = useState(false)

    const Component = children

    return (
        <Modal
            open={ open }
            onOpenChange={ setOpen }
            title="Create playlist"
            trigger={ Component }
        >
            <CreatePlaylistModal />
        </Modal>
    )
}
