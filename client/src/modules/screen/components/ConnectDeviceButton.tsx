import { Modal } from '@shared/ui/modal/Modal'
import { useState } from 'react'
import { ConnectDeviceModal } from './modals/ConnectDeviceModal'
import { Button } from '@shared/ui/buttons/Button'

export const ConnectDeviceButton = ({ buttonText }: { buttonText: string }) => {
    const [open, setOpen] = useState(false)

    return (
        <Modal
            open={ open }
            title="Connect device"
            onOpenChange={ setOpen }
            trigger={
                <Button>
                    { buttonText }
                </Button>
            }
        >
            <div className='max-w-[500px]'>
                <ConnectDeviceModal onClose={ () => setOpen(false) }/>
            </div>
        </Modal>
    )
}
