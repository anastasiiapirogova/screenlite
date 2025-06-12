import { ReactElement, useState } from 'react'
import { AddPlaylistScheduleModal } from '../modals/AddPlaylistScheduleModal'
import { Modal } from '@shared/ui/modal/Modal'

type Props = {
	children: ReactElement
}

export const AddPlaylistScheduleButton = ({ children }: Props) => {
    const [open, setOpen] = useState(false)

    const Component = children

    return (
        <Modal
            open={ open }
            onOpenChange={ setOpen }
            trigger={ Component }
            title="Add schedule" 
        >
            <div className='max-w-[500px]'>
                <AddPlaylistScheduleModal onClose={ () => setOpen(false) } />
            </div>
        </Modal>
    )
}
