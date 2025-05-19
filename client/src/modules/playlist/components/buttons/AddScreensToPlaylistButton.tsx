import { useState } from 'react'
import { Button } from '../../../../shared/ui/buttons/Button'
import { AddScreensToPlaylistModal } from '../modals/AddScreensToPlaylistModal'
import { Modal } from '@shared/ui/modal/Modal'

export const AddScreensToPlaylistButton = ({ buttonText }: { buttonText: string }) => {
    const [open, setOpen] = useState(false)

    return (
        <Modal
            open={ open }
            onOpenChange={ setOpen }
            trigger={
                <Button>
                    { buttonText }
                </Button>
            }
            title='Add screens'

        >
            <AddScreensToPlaylistModal onClose={ () => setOpen(false) }/>
        </Modal>
    )
}
