import { ReactElement, useState } from 'react'
import { CreatePlaylistLayoutModal } from './modals/CreatePlaylistLayoutModal.js'
import { Modal } from '@shared/ui/modal/Modal.js'

export const CreatePlaylistLayoutButton = ({ children }: { children: ReactElement }) => {
    const [open, setOpen] = useState(false)

    const Component = children

    return (
        <Modal
            open={ open }
            onOpenChange={ setOpen }
            trigger={ Component }
            title="Create layout"
        >
            <div className='max-w-[500px]'>
                <CreatePlaylistLayoutModal />
            </div>
        </Modal>
    )
}
