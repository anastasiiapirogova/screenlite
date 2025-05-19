import { ReactElement, useState } from 'react'
import { Modal } from '@shared/ui/modal/Modal'
import { ChangePlaylistLayoutModal } from '../modals/ChangePlaylistLayoutModal.js'

type Props = {
	children: ReactElement
}

export const ChangePlaylistLayoutButton = ({ children }: Props) => {
    const [open, setOpen] = useState(false)

    return (
        <Modal
            open={ open }
            onOpenChange={ setOpen }
            title="Choose layout"
            trigger={ children }
            maxWidth='max-w-[900px]'
        >
            <ChangePlaylistLayoutModal closeModal={ () => setOpen(false) } />
        </Modal>
    )
}
