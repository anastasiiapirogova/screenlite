import { ReactElement, useState } from 'react'
import { CreateScreenModal } from './modals/CreateScreenModal'
import { Modal } from '@shared/ui/modal/Modal'

type Props = {
    children: ReactElement
}

export const CreateScreenButton = ({ children }: Props) => {
    const [open, setOpen] = useState(false)

    return (
        <Modal
            open={ open }
            onOpenChange={ setOpen }
            title="Create screen"
            trigger={ children }
        >
            <div className='max-w-[500px]'>
                <CreateScreenModal />
            </div>
        </Modal>
    )
}